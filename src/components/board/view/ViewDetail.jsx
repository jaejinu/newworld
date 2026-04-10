'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { boardDummy } from '@/lib/constants/boardDummy';
import { formatDate } from '@/lib/utils/postUtils';
import { getBreadcrumb } from '@/lib/utils/menuUtils';
import { getPostBySlug, getAdjacentPosts } from '@/lib/utils/postDetailUtils';
import BasicList from '@/components/board/basicList/BasicList';
import AdBanner from '@/components/adBanner/adBanner';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import styles from './ViewDetail.module.css';
import Image from 'next/image';
import Reply from '@/components/board/reply/Reply';

const SITE_NAME = '더원서울안과 공식 블로그';


function ShareButtons({ post }) {
  const [isActive, setIsActive] = useState(false);

  const handleShare = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className={`share-box${isActive ? ' active' : ''}`}>
      <button type="button" className="btn radius" onClick={handleShare}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
          <path d="M9.537 12.6667C9.038 12.6667 8.61433 12.4922 8.266 12.1432C7.91778 11.7942 7.74367 11.3704 7.74367 10.8718C7.74367 10.8052 7.76672 10.6432 7.81283 10.3858L3.07183 7.59483C2.91117 7.7615 2.72028 7.89206 2.49917 7.9865C2.27806 8.08095 2.04117 8.12817 1.7885 8.12817C1.29172 8.12817 0.869444 7.95294 0.521667 7.6025C0.173889 7.25206 0 6.829 0 6.33333C0 5.83767 0.173889 5.41461 0.521667 5.06417C0.869444 4.71372 1.29172 4.5385 1.7885 4.5385C2.04117 4.5385 2.27806 4.58572 2.49917 4.68017C2.72028 4.77461 2.91117 4.90517 3.07183 5.07183L7.81283 2.28717C7.78639 2.20517 7.76822 2.12483 7.75833 2.04617C7.74856 1.9675 7.74367 1.88372 7.74367 1.79483C7.74367 1.29628 7.91828 0.8725 8.2675 0.5235C8.61683 0.1745 9.041 0 9.54 0C10.039 0 10.4626 0.174667 10.8108 0.524C11.1592 0.873222 11.3333 1.29733 11.3333 1.79633C11.3333 2.29533 11.1588 2.719 10.8098 3.06733C10.4608 3.41556 10.0371 3.58967 9.5385 3.58967C9.28461 3.58967 9.0485 3.54139 8.83017 3.44483C8.61172 3.34828 8.42217 3.21667 8.2615 3.05L3.5205 5.841C3.54694 5.92311 3.56511 6.00345 3.575 6.082C3.58478 6.16067 3.58967 6.24444 3.58967 6.33333C3.58967 6.42222 3.58478 6.506 3.575 6.58467C3.56511 6.66322 3.54694 6.74356 3.5205 6.82567L8.2615 9.61667C8.42217 9.45 8.61172 9.31839 8.83017 9.22183C9.0485 9.12528 9.28461 9.077 9.5385 9.077C10.0371 9.077 10.4608 9.25161 10.8098 9.60083C11.1588 9.95017 11.3333 10.3743 11.3333 10.8733C11.3333 11.3723 11.1587 11.7959 10.8093 12.1442C10.4601 12.4925 10.036 12.6667 9.537 12.6667Z" fill="#404040" fillOpacity="0.5" />
        </svg>
        <span>공유하기</span>
      </button>
      <div className="share-icon-box">
          <a href="" className="share-icon-facebook">            
            <Image src="/images/icon/ico-facebook.svg" width={31} height={31} alt="페이스북" />
          </a>
          <a href="" className="share-icon-twitter">
            <Image src="/images/icon/ico-twitter.svg" width={31} height={31} alt="엑스" />
          </a>
          <a href="" className="share-icon-instagram">
            <Image src="/images/icon/ico-instagram.svg" width={31} height={31} alt="인스타그램" />
          </a>
          <a href="" className="share-icon-kakao">
            <Image src="/images/icon/ico-kakao.svg" width={31} height={31} alt="카카오" />
          </a>
          <a href="" className="share-icon-pinterest">
            <Image src="/images/icon/ico-pinterest.svg" width={31} height={31} alt="핀터레스트" />
          </a>
          <a href="" className="share-icon-link">
            <Image src="/images/icon/ico-copyLink.svg" width={31} height={31} alt="링크복사" />
          </a>
        </div>
    </div>
  );
}

function AdjacentPosts({ prev, next }) {
  return (
    <div className={styles.nextPrevBox}>
      <div className={styles.prevBox}>
        {prev ? (
          <>
            <button type="button" className={`${styles.prevBtn} pc-block`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 23 23" fill="none">
                <path d="M9.48562 11.875L11.6922 14.0819C11.8093 14.1987 11.8638 14.3381 11.8556 14.5C11.8477 14.6619 11.7852 14.8013 11.6681 14.9181C11.5513 15.0352 11.4066 15.0938 11.2341 15.0938C11.0616 15.0938 10.9195 15.0352 10.8078 14.9181L7.84625 11.9569C7.64417 11.7548 7.54313 11.5192 7.54313 11.25C7.54313 10.9808 7.64417 10.7452 7.84625 10.5431L10.8319 7.55781C10.9487 7.44073 11.0881 7.38219 11.25 7.38219C11.4119 7.38219 11.5513 7.44073 11.6681 7.55781C11.7852 7.67469 11.8438 7.81937 11.8438 7.99187C11.8438 8.16458 11.7852 8.30667 11.6681 8.41813L9.48562 10.625H15C15.1771 10.625 15.3255 10.685 15.4453 10.805C15.5651 10.925 15.625 11.0736 15.625 11.2509C15.625 11.4282 15.5651 11.5766 15.4453 11.6959C15.3255 11.8153 15.1771 11.875 15 11.875H9.48562ZM11.2459 22.5C12.8016 22.5 14.2642 22.2048 15.6337 21.6144C17.0031 21.024 18.1944 20.2227 19.2075 19.2106C20.2206 18.1985 21.0226 17.0083 21.6134 15.64C22.2045 14.2719 22.5 12.8099 22.5 11.2541C22.5 9.69844 22.2048 8.23583 21.6144 6.86625C21.024 5.49687 20.2227 4.30562 19.2106 3.2925C18.1985 2.27937 17.0083 1.4774 15.64 0.886562C14.2719 0.295521 12.8099 0 11.2541 0C9.69844 0 8.23583 0.295209 6.86625 0.885626C5.49687 1.47604 4.30562 2.27729 3.2925 3.28938C2.27938 4.30146 1.4774 5.49167 0.886562 6.86C0.295521 8.22813 0 9.6901 0 11.2459C0 12.8016 0.29521 14.2642 0.885626 15.6337C1.47604 17.0031 2.27729 18.1944 3.28938 19.2075C4.30146 20.2206 5.49167 21.0226 6.86 21.6134C8.22813 22.2045 9.6901 22.5 11.2459 22.5ZM11.25 21.25C8.45833 21.25 6.09375 20.2812 4.15625 18.3438C2.21875 16.4062 1.25 14.0417 1.25 11.25C1.25 8.45833 2.21875 6.09375 4.15625 4.15625C6.09375 2.21875 8.45833 1.25 11.25 1.25C14.0417 1.25 16.4062 2.21875 18.3438 4.15625C20.2812 6.09375 21.25 8.45833 21.25 11.25C21.25 14.0417 20.2812 16.4062 18.3438 18.3438C16.4062 20.2812 14.0417 21.25 11.25 21.25Z" fill="#777777"></path>
              </svg>
            </button>
            <Link href={prev.url} className={styles.thumbCaption}>
              <div className={styles.thumbLabel}>이전글</div>
              <h3 className={styles.thumbTitle}>{prev.name}</h3>
              <div className={styles.postRowInfo}>
                <div className={styles.postRowAuthor}>
                  <span className={styles.postRowAuthorImg}>
                    <Image src="/images/common/logo-small.svg" alt={SITE_NAME} width={39} height={33} />
                  </span>
                  <div>
                    <p className={styles.postRowAuthorName}>{SITE_NAME}</p>
                    <p className={styles.postRowDate}>{formatDate(prev.date)}</p>
                  </div>
                </div>
              </div>            
            </Link>
          </>
        ) : (
          <p className={styles.noEmpty}>이전 글이 없습니다</p>
        )}
      </div>
      <div className="line" />
      <div className={styles.nextBox}>
        {next ? (
          <>
          <Link href={next.url} className={styles.thumbCaption}>
            <div className={styles.thumbLabel}>다음글</div>
            <h3 className={styles.thumbTitle}>{next.name}</h3>
            <div className={styles.postRowInfo}>
              <div className={styles.postRowAuthor}>
                <span className={styles.postRowAuthorImg}>
                  <Image src="/images/common/logo-small.svg" alt={SITE_NAME} width={39} height={33}/>
                </span>
                <div>
                  <p className={styles.postRowAuthorName}>{SITE_NAME}</p>
                  <p className={styles.postRowDate}>{formatDate(next.date)}</p>
                </div>
              </div>
            </div>
          </Link>
          <button type="button" className={`${styles.nextBtn} pc-block`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
              <path d="M13.0144 11.875L10.8078 14.0819C10.6907 14.1987 10.6362 14.3381 10.6444 14.5C10.6523 14.6619 10.7148 14.8013 10.8319 14.9181C10.9487 15.0352 11.0934 15.0938 11.2659 15.0938C11.4384 15.0938 11.5805 15.0352 11.6922 14.9181L14.6537 11.9569C14.8558 11.7548 14.9569 11.5192 14.9569 11.25C14.9569 10.9808 14.8558 10.7452 14.6537 10.5431L11.6681 7.55781C11.5513 7.44073 11.4119 7.38219 11.25 7.38219C11.0881 7.38219 10.9487 7.44073 10.8319 7.55781C10.7148 7.67469 10.6562 7.81937 10.6562 7.99187C10.6562 8.16458 10.7148 8.30667 10.8319 8.41813L13.0144 10.625H7.5C7.32292 10.625 7.17448 10.685 7.05469 10.805C6.9349 10.925 6.875 11.0736 6.875 11.2509C6.875 11.4282 6.9349 11.5766 7.05469 11.6959C7.17448 11.8153 7.32292 11.875 7.5 11.875H13.0144ZM11.2541 22.5C9.69844 22.5 8.23583 22.2048 6.86625 21.6144C5.49687 21.024 4.30562 20.2227 3.2925 19.2106C2.27938 18.1985 1.4774 17.0083 0.886562 15.64C0.295521 14.2719 0 12.8099 0 11.2541C0 9.69844 0.295208 8.23583 0.885625 6.86625C1.47604 5.49687 2.27729 4.30562 3.28937 3.2925C4.30146 2.27937 5.49167 1.4774 6.86 0.886562C8.22812 0.295521 9.6901 0 11.2459 0C12.8016 0 14.2642 0.295209 15.6338 0.885626C17.0031 1.47604 18.1944 2.27729 19.2075 3.28938C20.2206 4.30146 21.0226 5.49167 21.6134 6.86C22.2045 8.22813 22.5 9.6901 22.5 11.2459C22.5 12.8016 22.2048 14.2642 21.6144 15.6337C21.024 17.0031 20.2227 18.1944 19.2106 19.2075C18.1985 20.2206 17.0083 21.0226 15.64 21.6134C14.2719 22.2045 12.8099 22.5 11.2541 22.5ZM11.25 21.25C14.0417 21.25 16.4062 20.2812 18.3438 18.3438C20.2812 16.4062 21.25 14.0417 21.25 11.25C21.25 8.45833 20.2812 6.09375 18.3438 4.15625C16.4062 2.21875 14.0417 1.25 11.25 1.25C8.45833 1.25 6.09375 2.21875 4.15625 4.15625C2.21875 6.09375 1.25 8.45833 1.25 11.25C1.25 14.0417 2.21875 16.4062 4.15625 18.3438C6.09375 20.2812 8.45833 21.25 11.25 21.25Z" fill="#777777"></path>
            </svg>
          </button>
          </>
        ) : (
          <p className={styles.noEmpty}>다음 글이 없습니다</p>
        )}
      </div>
    </div>
  );
}

export default function ViewDetail({ categorySlug, viewSlug }) {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);

  const post = useMemo(() => getPostBySlug(categorySlug, viewSlug), [categorySlug, viewSlug]);
  const { prev, next } = useMemo(() => getAdjacentPosts(post), [post]);

  if (!post) {
    return (
      <section className={styles.boardView}>
        <div className="section-inner">
          <p className={styles.noEmpty}>게시글을 찾을 수 없습니다.</p>
        </div>
      </section>
    );
  }

  const formattedDate = formatDate(post.date);

  return (
    <section className={styles.boardView}>
      <div className="section-inner feed-grid">
        <div className="feed-main">
          <div className={styles.boardContentWrap}>
            <div className={styles.boardHead}>
              <Breadcrumb items={breadcrumb} />

              <div className={styles.badgeBox}>
                {post.category && <span className="badge-type sky">{post.categoryName}</span>}
              </div>

              <div className={styles.titleBox}>
                <h1 className={styles.title}>{post.name}</h1>
              </div>

              <div className={styles.boardInfo}>
                <div className={styles.postRowAuthor}>
                  <span className={styles.postRowAuthorImg}>
                    <Image src="/images/common/logo-small.svg" alt={SITE_NAME} width={39} height={33} />
                  </span>
                  <div>
                    <p className={styles.postRowAuthorName}>{SITE_NAME}</p>
                    <p className={styles.postRowDate}>{formattedDate}</p>
                  </div>
                </div>
                <ul className="btn-group">
                  <li className="btn radius">
                    <span className="ico">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8.00301 10.1025C8.68045 10.1025 9.25529 9.86537 9.72751 9.39115C10.1997 8.91692 10.4358 8.34109 10.4358 7.66365C10.4358 6.9862 10.1987 6.41137 9.72451 5.93915C9.25029 5.46692 8.67445 5.23081 7.99701 5.23081C7.31957 5.23081 6.74473 5.46792 6.27251 5.94215C5.80029 6.41637 5.56418 6.9922 5.56418 7.66965C5.56418 8.34709 5.80129 8.92192 6.27551 9.39415C6.74973 9.86637 7.32556 10.1025 8.00301 10.1025ZM8.00001 9.46665C7.50001 9.46665 7.07501 9.29165 6.72501 8.94165C6.37501 8.59165 6.20001 8.16665 6.20001 7.66665C6.20001 7.16665 6.37501 6.74165 6.72501 6.39165C7.07501 6.04165 7.50001 5.86665 8.00001 5.86665C8.50001 5.86665 8.92501 6.04165 9.27501 6.39165C9.62501 6.74165 9.80001 7.16665 9.80001 7.66665C9.80001 8.16665 9.62501 8.59165 9.27501 8.94165C8.92501 9.29165 8.50001 9.46665 8.00001 9.46665ZM8.00001 12C6.68201 12 5.47323 11.6513 4.37368 10.9538C3.27412 10.2564 2.3859 9.34187 1.70901 8.21031C1.65345 8.11876 1.6139 8.02854 1.59034 7.93965C1.5669 7.85076 1.55518 7.75954 1.55518 7.66598C1.55518 7.57242 1.5669 7.48142 1.59034 7.39298C1.6139 7.30454 1.65345 7.21454 1.70901 7.12298C2.3859 5.99142 3.27412 5.07692 4.37368 4.37948C5.47323 3.68204 6.68201 3.33331 8.00001 3.33331C9.31801 3.33331 10.5268 3.68204 11.6263 4.37948C12.7259 5.07692 13.6141 5.99142 14.291 7.12298C14.3466 7.21454 14.3861 7.30476 14.4097 7.39365C14.4331 7.48254 14.4448 7.57376 14.4448 7.66731C14.4448 7.76087 14.4331 7.85187 14.4097 7.94031C14.3861 8.02876 14.3466 8.11876 14.291 8.21031C13.6141 9.34187 12.7259 10.2564 11.6263 10.9538C10.5268 11.6513 9.31801 12 8.00001 12ZM8.00001 11.3333C9.25557 11.3333 10.4083 11.0028 11.4583 10.3416C12.5083 9.68054 13.3111 8.78887 13.8667 7.66665C13.3111 6.54442 12.5083 5.65276 11.4583 4.99165C10.4083 4.33054 9.25557 3.99998 8.00001 3.99998C6.74445 3.99998 5.59168 4.33054 4.54168 4.99165C3.49168 5.65276 2.6889 6.54442 2.13334 7.66665C2.6889 8.78887 3.49168 9.68054 4.54168 10.3416C5.59168 11.0028 6.74445 11.3333 8.00001 11.3333Z" fill="#404040" fillOpacity="0.5"></path>
                      </svg>
                    </span>
                    <p className="text-box"><span className="view-count">10</span><span className="pc-block">조회수</span></p>
                  </li>
                  <li className="btn radius">
                    <i className="ico">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 7.5H10.1667V6.5H2.5V7.5ZM2.5 5.5H10.1667V4.5H2.5V5.5ZM2.5 3.5H10.1667V2.5H2.5V3.5ZM12.6667 12.359L10.3077 10H1.20517C0.868389 10 0.583333 9.88333 0.35 9.65C0.116667 9.41667 0 9.13161 0 8.79483V1.20517C0 0.868389 0.116667 0.583333 0.35 0.35C0.583333 0.116667 0.868389 0 1.20517 0H11.4615C11.7983 0 12.0833 0.116667 12.3167 0.35C12.55 0.583333 12.6667 0.868389 12.6667 1.20517V12.359ZM1.20517 9H10.7333L11.6667 9.92317V1.20517C11.6667 1.15383 11.6453 1.10683 11.6025 1.06417C11.5598 1.02139 11.5128 1 11.4615 1H1.20517C1.15383 1 1.10683 1.02139 1.06417 1.06417C1.02139 1.10683 1 1.15383 1 1.20517V8.79483C1 8.84617 1.02139 8.89317 1.06417 8.93583C1.10683 8.97861 1.15383 9 1.20517 9Z" fill="#676767"></path>
                      </svg>
                    </i>
                    <p className="text-box"><span className="reply-count">0</span><span className="pc-block">댓글</span></p>
                  </li>              
                </ul>
              </div>

              <ShareButtons post={post} />
            </div>

            <div
              className={styles.boardContent}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tags?.length > 0 && (
              <div className="tag-box">
                <span className="badge-type sky tag-title">TAGS</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="badge-type sky">#{tag}</span>
                ))}
              </div>
            )}

            <div className="opacity-line" />

            <AdjacentPosts prev={prev} next={next} />

            <Reply />
          </div>
        </div>

        <div className="sticky-area">
          <div className="side-card-head">
            <div className="section-left">
              <span className="flag-type sky">게시판 공지글 ⭐</span>
            </div>
          </div>
          <BasicList bgColor="black" listType="list" itemType="noticePost" number={3} />
          <AdBanner />
        </div>
      </div>
    </section>
  );
}
