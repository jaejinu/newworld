'use client';

import { useEffect, useRef } from 'react';

/**
 * scrollTop이 0이 아닐 때 html에 is-fixed 클래스 추가/제거
 * 아래로 스크롤 시 scroll-down 추가, 위로 스크롤 시 scroll-down 제거
 */
export function useScrollClass() {
    const prevScrollY = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY ?? document.documentElement.scrollTop;

            // is-fixed: scrollTop > 0
            if (scrollTop > 0) {
                document.documentElement.classList.add('is-fixed');
            } else {
                document.documentElement.classList.remove('is-fixed');
                document.documentElement.classList.remove('scroll-down');
            }

            // scroll-down: 아래로 스크롤 시 추가, 위로 스크롤 시 제거 (초기 마운트 제외)
            if (prevScrollY.current !== null) {
                if (scrollTop > prevScrollY.current) {
                    document.documentElement.classList.add('scroll-down');
                } else if (scrollTop < prevScrollY.current) {
                    document.documentElement.classList.remove('scroll-down');
                }
            }
            prevScrollY.current = scrollTop;
        };

        handleScroll(); // 초기 마운트 시 상태 적용
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.documentElement.classList.remove('is-fixed', 'scroll-down');
        };
    }, []);
}
