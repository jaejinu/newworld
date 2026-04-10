'use client';
import styles from './QickMenu.module.css';
import Image from 'next/image';
export default function QickMenu() {        
    const scrollTopMove = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    return (
        <div className={styles.quickMenu}>
            <ul>
                <li className={styles.menuCall}>
                    <a href="javascript:void(0)">
                        <i>
                        <Image src="/images/icon/quick_circle_deco.svg" className={styles.iconEffect} alt="데코이미지" width={50} height={50} />
                        <Image src="/images/icon/quick_phone_icon.svg" alt="전화상담" width={26} height={26} />
                        </i>
                        <span>전화상담</span>
                    </a>
                </li>
                <li className={styles.menuReserve}>
                    <a href="javascript:void(0)">
                        <i>
                        <Image src="/images/icon/quick_circle_deco.svg" className={styles.iconEffect} alt="데코이미지" width={50} height={50} />
                        <Image src="/images/icon/quick_reser_icon.svg" alt="진료예약" width={26} height={26} />
                        </i>
                        <span>진료예약</span>
                    </a>
                </li>
                <li className={styles.menuOnline}>
                    <a href="javascript:void(0)">
                        <i>
                        <Image src="/images/icon/quick_circle_deco.svg" className={styles.iconEffect} alt="데코이미지" width={50} height={50} />
                        <Image src="/images/icon/quick_talk_icon.svg" alt="온라인상담" width={26} height={26} />
                        </i>
                        <span>온라인상담</span>
                    </a>
                </li>
                <li className={styles.menuTop}>
                    <a href="/" onClick={scrollTopMove}>
                        <i>
                        <Image src="/images/icon/quick_circle_deco.svg" className={styles.iconEffect} alt="데코이미지" width={50} height={50} />
                        <Image src="/images/icon/quick_top_icon.svg" alt="TOP" width={26} height={26} />
                        </i>
                        <span>TOP</span>
                    </a>
                </li>
            </ul>
        </div>
    )
}