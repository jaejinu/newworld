'use client';
import styles from './TopMenu.module.css';
import { menuStructure } from '@/lib/constants/menuStructure';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Search from './Search';
import useMobileMenuClass from '@/hooks/useMobileMenuClass';
import { useEffect, useRef, useState } from 'react';

function pxNumber(value) {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : 0;
}

function measureSubmenuHeightPx(ulEl) {
    if (!ulEl) return 0;
    const items = ulEl.querySelectorAll('li');
    const count = items.length;
    if (!count) return 0;

    const sample = items[0];
    const itemHeight = sample.getBoundingClientRect().height;

    const firstStyle = window.getComputedStyle(items[0]);
    const lastStyle = window.getComputedStyle(items[count - 1]);
    const firstMarginTop = pxNumber(firstStyle.marginTop);
    const lastMarginBottom = pxNumber(lastStyle.marginBottom);

    return count * itemHeight + firstMarginTop + lastMarginBottom;
}

export default function TopMenu({ onRequestClose }) {
    const pathname = usePathname();
    const { close } = useMobileMenuClass();
    const handleClose = onRequestClose ?? close;
    const [openMenuId, setOpenMenuId] = useState(null);
    const [submenuHeights, setSubmenuHeights] = useState({});
    const submenuRefs = useRef(new Map());

    const handleToggleSubMenu = (menuId) => (e) => {
        e.preventDefault();
        setOpenMenuId((prev) => (prev === menuId ? null : menuId));
    };

    const handleNavigate = (e) => {
        handleClose(e);
        setOpenMenuId(null);
    };

    const setSubmenuRef = (menuId) => (el) => {
        if (!el) {
            submenuRefs.current.delete(menuId);
            return;
        }
        submenuRefs.current.set(menuId, el);
    };

    const recomputeHeights = () => {
        const next = {};
        submenuRefs.current.forEach((ulEl, menuId) => {
            next[menuId] = measureSubmenuHeightPx(ulEl);
        });
        setSubmenuHeights(next);
    };

    useEffect(() => {
        recomputeHeights();

        const handleResize = () => recomputeHeights();
        window.addEventListener('resize', handleResize);

        let ro;
        if ('ResizeObserver' in window) {
            ro = new ResizeObserver(() => recomputeHeights());
            submenuRefs.current.forEach((ulEl) => ro.observe(ulEl));
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (ro) ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 열고 닫힐 때(특히 첫 오픈) 폰트/레이아웃 반영해서 한번 더 계산
        recomputeHeights();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openMenuId]);

    return (
        <div className={styles.topMenuContainer}>
            <div className={`${styles.topMenuInner} inner-con`}>
                <ul className={styles.topMenuWrap}>
                    {menuStructure.map((menu) => {
                        const isMenuCurrent = pathname === menu.url || (menu.depth2?.some((d) => d.url === pathname) ?? false);
                        return (
                        <li
                            className={`${styles.menuItem} ${isMenuCurrent ? styles.current : ''}`}
                            key={menu.id}
                        >
                            <Link href={menu.url}>
                                {menu.name}
                            </Link>
                            <ul className={styles.subMenu}>
                                {menu.depth2?.map((depth2) => (
                                    <li
                                        className={`${styles.subMenuItem} ${pathname === depth2.url ? styles.current : ''}`}
                                        key={depth2.id}
                                    >
                                        <Link href={depth2.url}>{depth2.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        );
                    })}
                </ul>
                <Search />
            </div>
            <div className={styles.mobileMenu}>
                <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="메뉴 닫기" />
                <ul className={styles.mobileMenuList}>
                    {menuStructure.map((menu) => {
                        const hasDepth2 = menu.depth2?.length > 0;
                        const submenuHeightPx = submenuHeights[menu.id] ?? 0;
                        const isMenuCurrent = pathname === menu.url || (menu.depth2?.some((d) => d.url === pathname) ?? false);
                        return (
                            <li
                                key={menu.id}
                                className={`${styles.menuItem} ${hasDepth2 ? styles.hasSubMenu : ''} ${openMenuId === menu.id ? styles.subMenuOpen : ''} ${isMenuCurrent ? styles.current : ''}`}
                            >
                                {hasDepth2 ? (
                                    <a href={menu.url} onClick={handleToggleSubMenu(menu.id)}>
                                        {menu.name}
                                    </a>
                                ) : (
                                    <Link href={menu.url} onClick={handleNavigate}>
                                        {menu.name}
                                    </Link>
                                )}
                                <ul
                                    className={styles.mobileSubMenu}
                                    ref={setSubmenuRef(menu.id)}
                                    style={{ '--submenu-height': `${submenuHeightPx}px` }}
                                >
                                    {menu.depth2?.map((depth2) => (
                                        <li
                                            className={`${styles.subMenuItem} ${pathname === depth2.url ? styles.current : ''}`}
                                            key={depth2.id}
                                        >
                                            <Link href={depth2.url} onClick={handleNavigate}>
                                                {depth2.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
                <button type="button" className={styles.mobileMenuDimmed} onClick={handleClose} aria-label="메뉴 닫기" />
            </div>
        </div>
    );
}