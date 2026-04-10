import styles from './adBanner.module.css';
export default function AdBanner() {
    return (
        <div className={styles.adBannerArea}>
            <a href="/" className={styles.adBanner} target="_blank">
                <div className={styles.imgBox}>
                    <img src="/images/common/ad-banner-sample.png" alt="광고배너" />
                </div>
                <div className={styles.textBox}>
                    <p>수술 다음 날 출근도…빠른 회복 앞세운 '투데이라섹' 관심↑</p>
                </div>
            </a>
        </div>
    );
}