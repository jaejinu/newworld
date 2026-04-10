'use client';

import { useScrollClass } from '@/hooks/useScrollClass';

/**
 * scrollTop > 0 일 때 html에 is-fixed 클래스 추가
 * layout에서 사용
 */
export default function ScrollClassEffect() {
    useScrollClass();
    return null;
}
