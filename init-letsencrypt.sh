#!/bin/bash

# shinsegaeeye.com SSL 인증서 초기 발급 스크립트
# 사용법: sudo bash init-letsencrypt.sh

DOMAIN="shinsegaeeye.com"
EMAIL="admin@shinsegaeeye.com"  # Let's Encrypt 알림용 이메일 (변경 필요)
STAGING=0  # 테스트 시 1로 변경 (Let's Encrypt rate limit 방지)
DATA_PATH="./certbot"

echo "### SSL 파라미터 다운로드 중..."
mkdir -p "$DATA_PATH/conf"
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$DATA_PATH/conf/options-ssl-nginx.conf"
fi
if [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$DATA_PATH/conf/ssl-dhparams.pem"
fi

# 1. 임시 자체 서명 인증서 생성 (Nginx 시작용)
echo "### 임시 인증서 생성 중..."
LIVE_PATH="$DATA_PATH/conf/live/$DOMAIN"
mkdir -p "$LIVE_PATH"
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout "$LIVE_PATH/privkey.pem" \
  -out "$LIVE_PATH/fullchain.pem" \
  -subj "/CN=localhost" 2>/dev/null

# 2. Nginx만 시작 (임시 인증서로)
echo "### Nginx 시작 중..."
docker-compose up -d nginx
sleep 3

# Nginx 정상 시작 확인
if ! docker-compose ps nginx | grep -q "Up"; then
  echo "ERROR: Nginx 시작 실패. 로그 확인:"
  docker-compose logs nginx
  exit 1
fi
echo "### Nginx 시작 완료"

# 3. 임시 인증서 삭제
echo "### 임시 인증서 삭제 중..."
rm -rf "$LIVE_PATH"

# 4. Let's Encrypt 실제 인증서 발급
echo "### Let's Encrypt 인증서 발급 중..."
STAGING_ARG=""
if [ "$STAGING" != "0" ]; then
  STAGING_ARG="--staging"
fi

docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  $STAGING_ARG \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

# 5. 발급 결과 확인
if [ ! -e "$LIVE_PATH/fullchain.pem" ]; then
  echo "ERROR: 인증서 발급 실패!"
  echo "도메인 DNS가 이 서버 IP를 가리키는지 확인하세요."
  echo "  nslookup $DOMAIN"
  exit 1
fi

# 6. Nginx 재시작 (실제 인증서 적용)
echo "### Nginx 재시작 중..."
docker-compose restart nginx

echo "### 완료! SSL 인증서가 발급되었습니다."
echo "https://$DOMAIN 으로 접속해보세요."
