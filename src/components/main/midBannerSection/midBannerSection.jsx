import Image from "next/image";
import styles from "./midBannerSection.module.css";
export default function MidBannerSection() {
    return (
        <section className={styles.midBanner}>
            <div className={styles.midBannerInner}>
                <a href="https://www.naver.com" target="_blank">
                    <Image src="/images/common/mid-banner-01.png" width={1920} height={160} alt="중간배너" className="pc-block" />
                    <Image src="/images/common/mid-banner-01-mo.png" width={375} height={120} alt="중간배너" className="m-block" />
                </a>
            </div>
        </section>
    )
}