import QickMenu from "../qickMenu/QickMenu";
import styles from "./Footer.module.css";
import BasicList from "@/components/board/basicList/BasicList";

export default function Footer() {
    return (
        <footer className={styles.siteFooter}>
            <div className={styles.footerTop}>
                <div className={styles.footerInner}>
                    <div className={styles.footerInfo}>
                        <div className={styles.footerLogo}>
                            <img src="/images/common/logo-wh.svg" alt="더원서울안과 로고" />
                        </div>
                        <div className={styles.footerTextGroup}>
                            <div>
                                <p className={styles.footerText}>더원서울안과의원</p>
                                <p className={styles.footerText}>대표 허장원</p>
                                <p className={styles.footerText}>주소 서울특별시 강남구 강남대로652(신사동504-11) 신사스퀘어 8, 9층</p>
                            </div>
                            <div>
                                <p className={styles.footerText}>대표전화 02-585-0202</p>
                                <p className={styles.footerText}>사업자번호 468-93-01492</p>
                                <p className={styles.footerText}>개인정보처리관리자 허장원 원장 02-585-0202</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footerLatest}>
                        <BasicList bgColor="black" listType="slide" itemType="recommended" number={10}  />
                    </div>
                </div>
            </div>            
            <div className={styles.footerBottom}>
                <div className={`${styles.sectionInner} ${styles.footerBottomInner}`}>
                    <p className={styles.footerCopy}>ⓒ THE ONE SEOUL EYE CLINIC. ALL RIGHTS RESERVED.</p>
                    <div className={styles.footerSocial}>
                        <a href="https://the1seoul.com/ko" target="_blank" rel="noopener noreferrer" className={styles.footerSocialBtn} aria-label="홈페이지">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                <path
                                    d="M0 15.5V6.5C0 6.18333 0.0708333 5.88333 0.2125 5.6C0.354167 5.31667 0.55 5.08333 0.8 4.9L6.8 0.4C7.15 0.133333 7.55 0 8 0C8.45 0 8.85 0.133333 9.2 0.4L15.2 4.9C15.45 5.08333 15.6458 5.31667 15.7875 5.6C15.9292 5.88333 16 6.18333 16 6.5V15.5C16 16.05 15.8042 16.5208 15.4125 16.9125C15.0208 17.3042 14.55 17.5 14 17.5H11C10.7167 17.5 10.4792 17.4042 10.2875 17.2125C10.0958 17.0208 10 16.7833 10 16.5V11.5C10 11.2167 9.90417 10.9792 9.7125 10.7875C9.52083 10.5958 9.28333 10.5 9 10.5H7C6.71667 10.5 6.47917 10.5958 6.2875 10.7875C6.09583 10.9792 6 11.2167 6 11.5V16.5C6 16.7833 5.90417 17.0208 5.7125 17.2125C5.52083 17.4042 5.28333 17.5 5 17.5H2C1.45 17.5 0.979167 17.3042 0.5875 16.9125C0.195833 16.5208 0 16.05 0 15.5Z"
                                    fill="white"
                                    fillOpacity="0.6"
                                />
                            </svg>
                        </a>
                        <a href="https://the1eye.com/kor/index.php" target="_blank" rel="noopener noreferrer" className={styles.footerSocialBtn} aria-label="병원">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                <path
                                    d="M7.375 9.625V12.125C7.375 12.4375 7.48458 12.7031 7.70375 12.9218C7.92275 13.1406 8.18875 13.25 8.50175 13.25C8.81475 13.25 9.08017 13.1406 9.298 12.9218C9.516 12.7031 9.625 12.4375 9.625 12.125V9.625H12.125C12.4375 9.625 12.7031 9.51542 12.9218 9.29625C13.1406 9.07725 13.25 8.81125 13.25 8.49825C13.25 8.18525 13.1406 7.91983 12.9218 7.702C12.7031 7.484 12.4375 7.375 12.125 7.375H9.625V4.875C9.625 4.5625 9.51542 4.29692 9.29625 4.07825C9.07725 3.85942 8.81125 3.75 8.49825 3.75C8.18525 3.75 7.91983 3.85942 7.702 4.07825C7.484 4.29692 7.375 4.5625 7.375 4.875V7.375H4.875C4.5625 7.375 4.29692 7.48458 4.07825 7.70375C3.85942 7.92275 3.75 8.18875 3.75 8.50175C3.75 8.81475 3.85942 9.08017 4.07825 9.298C4.29692 9.516 4.5625 9.625 4.875 9.625H7.375ZM1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H15.1923C15.6974 0 16.125 0.175 16.475 0.525C16.825 0.875 17 1.30258 17 1.80775V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775Z"
                                    fill="white"
                                    fillOpacity="0.6"
                                />
                            </svg>
                        </a>
                        <a href="#none" className={styles.footerSocialBtn} aria-label="TV">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M7.5 14.5L14.5 10L7.5 5.5V14.5ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                                    fill="white"
                                    fillOpacity="0.6"
                                />
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@the1seoul" target="_blank" rel="noopener noreferrer" className={styles.footerSocialBtn} aria-label="허심탄회">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M8 12L14 8L8 4V12ZM0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H4L0 20Z"
                                    fill="white"
                                    fillOpacity="0.6"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* 브라우저 우측 퀵 메뉴 영역 */}
            <QickMenu />
        </footer>
    );
}
