#!/bin/bash
set -euo pipefail

# ──────────────────────────────────────────────
# 블루그린 배포 스크립트
# 사용법: ./scripts/deploy-blue-green.sh [DOMAIN]
# 서버에서 실행됨 (GitHub Actions → SSH로 호출)
# ──────────────────────────────────────────────

COMPOSE_FILE="docker-compose.blue-green.yml"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="${1:-localhost}"
SLOT_FILE="$PROJECT_DIR/.active-slot"

cd "$PROJECT_DIR"

# 현재 활성 슬롯 확인 (기본값: blue)
if [ -f "$SLOT_FILE" ]; then
  CURRENT_SLOT=$(cat "$SLOT_FILE")
else
  CURRENT_SLOT="blue"
fi

# 배포 대상은 반대 슬롯
if [ "$CURRENT_SLOT" = "blue" ]; then
  NEW_SLOT="green"
else
  NEW_SLOT="blue"
fi

echo "=========================================="
echo "  블루그린 배포 시작"
echo "  현재 활성: $CURRENT_SLOT"
echo "  배포 대상: $NEW_SLOT"
echo "  도메인: $DOMAIN"
echo "=========================================="

# 1단계: 새 슬롯 빌드 및 시작
echo ""
echo "[1/5] $NEW_SLOT 슬롯 빌드 중..."
docker compose -f "$COMPOSE_FILE" build "api-${NEW_SLOT}" "web-${NEW_SLOT}"

echo ""
echo "[2/5] $NEW_SLOT 슬롯 시작 중..."
docker compose -f "$COMPOSE_FILE" up -d "api-${NEW_SLOT}" "web-${NEW_SLOT}"

# 2단계: 헬스체크
echo ""
echo "[3/5] $NEW_SLOT 슬롯 헬스체크 중..."
MAX_RETRIES=30
RETRY_INTERVAL=5
for i in $(seq 1 $MAX_RETRIES); do
  # API 헬스체크
  API_HEALTHY=$(docker inspect --format='{{.State.Health.Status}}' "theoneblog-api-${NEW_SLOT}" 2>/dev/null || echo "unhealthy")

  if [ "$API_HEALTHY" = "healthy" ]; then
    # Web 컨테이너 실행 확인
    WEB_RUNNING=$(docker inspect --format='{{.State.Running}}' "theoneblog-web-${NEW_SLOT}" 2>/dev/null || echo "false")
    if [ "$WEB_RUNNING" = "true" ]; then
      echo "  ✓ $NEW_SLOT 슬롯 정상 (API: healthy, Web: running)"
      break
    fi
  fi

  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "  ✗ 헬스체크 실패! 롤백합니다."
    docker compose -f "$COMPOSE_FILE" stop "api-${NEW_SLOT}" "web-${NEW_SLOT}"
    exit 1
  fi

  echo "  대기 중... ($i/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

# 3단계: nginx 전환
echo ""
echo "[4/5] nginx를 $NEW_SLOT 슬롯으로 전환 중..."

# active-slot.conf 교체
cp "$PROJECT_DIR/nginx/active-slot-${NEW_SLOT}.conf" "$PROJECT_DIR/nginx/active-slot.conf"

# nginx 설정에 도메인 적용
sed -i "s/\${DOMAIN}/$DOMAIN/g" "$PROJECT_DIR/nginx/nginx.blue-green.conf" 2>/dev/null || \
  sed -i '' "s/\${DOMAIN}/$DOMAIN/g" "$PROJECT_DIR/nginx/nginx.blue-green.conf"

# nginx 재시작 없이 설정 리로드
docker compose -f "$COMPOSE_FILE" exec -T nginx nginx -s reload || \
  docker compose -f "$COMPOSE_FILE" restart nginx

# 4단계: 이전 슬롯 정리
echo ""
echo "[5/5] $CURRENT_SLOT 슬롯 정리 중..."
sleep 5
docker compose -f "$COMPOSE_FILE" stop "api-${CURRENT_SLOT}" "web-${CURRENT_SLOT}"

# 활성 슬롯 기록
echo "$NEW_SLOT" > "$SLOT_FILE"

echo ""
echo "=========================================="
echo "  배포 완료!"
echo "  활성 슬롯: $NEW_SLOT"
echo "=========================================="
