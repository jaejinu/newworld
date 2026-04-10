'use client';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import TopMenu from './TopMenu';
import TopBanner from '@/components/topBanner/TopBanner';
import useMobileMenuClass from '@/hooks/useMobileMenuClass';

export default function Header() {
    const { toggle, close } = useMobileMenuClass();
    return (                
        <header className={styles.header}>
            <TopBanner />
            <div className={`${styles.headerInner} inner-con`}>
                <Link href="/" className={styles.logo}>
                    <Image src="/images/common/logo.svg" alt="더원서울안과" width={200} height={51} />
                    <span>BLOG</span>
                </Link>
                <ul className={styles.quickMenu}>
                    <li className={`${styles.item} ${styles.item1}`}>
                        <a href="https://the1seoul.com/ko" target="_blank">
                            <Image src="/images/icon/header-quick-ico-home.svg" alt="강남 더원서울안과 바로가기" width={24} height={24} />
                            <span>강남 더원서울안과 바로가기</span>
                        </a>
                    </li>
                    <li className={`${styles.item} ${styles.item2}`}>
                        <a href="https://the1eye.com/kor/index.php" target="_blank">
                            <Image src="/images/icon/header-quick-ico-center.svg" alt="녹내장·백내장센터" width={24} height={24} />
                            <span>녹내장·백내장센터</span>
                        </a>
                    </li>
                    <li className={`${styles.item} ${styles.item3}`}>
                        <a href="https://www.youtube.com/channel/UC4i-kYJ_r4SM26MEXKVNuVg" target="_blank">
                            <Image src="/images/icon/header-quick-ico-tv.svg" alt="더원서울안과 TV" width={24} height={24} />
                            <span>더원서울안과 TV</span>
                        </a>
                    </li>
                    <li className={`${styles.item} ${styles.item4}`}>
                        <a href="https://www.youtube.com/@the1seoul" target="_blank">
                            <Image src="/images/icon/header-quick-ico-talk.svg" alt="더원의 허심탄회" width={24} height={24} />
                            <span>더원의 허심탄회</span>
                        </a>
                    </li>
                </ul>
                <button className={styles.mobileMenuBtn} onClick={toggle}>
                    <div></div>
                    <div></div>
                    <div></div>
                </button>
            </div>
            <TopMenu onRequestClose={close} />
        </header>        
    )
}