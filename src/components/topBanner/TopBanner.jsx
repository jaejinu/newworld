'use client';
import Image from "next/image";
import styles from "./TopBanner.module.css";
import { useEffect, useRef } from "react";

export default function TopBanner() {
    const topBannerRef = useRef(null);
    const topBannerLinkRef = useRef(null);

    useEffect(() => {
        const updateBannerHeight = () => {
            if (topBannerRef.current && topBannerLinkRef.current) {
                topBannerRef.current.style.setProperty('--top-banner-height', topBannerLinkRef.current.offsetHeight + 'px');
            }
        };

        updateBannerHeight();
        window.addEventListener('resize', updateBannerHeight);

        return () => window.removeEventListener('resize', updateBannerHeight);
    }, []);


    return (
        <div className={styles.topBanner} ref={topBannerRef}>
            <a href="/" ref={topBannerLinkRef}>
                <Image src="/images/common/top-banner-01.png" alt="Top Banner" width={1920} height={70} className="pc-block"/>
                <Image src="/images/common/top-banner-01-mo.png" alt="Top Banner" width={500} height={53} className="m-block"/>
            </a>
        </div>
    )
}