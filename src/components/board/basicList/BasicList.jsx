'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { boardDummy } from '@/lib/constants/boardDummy';
import { formatDate, getThumbnail, getFilteredPosts } from '@/lib/utils/postUtils';
import styles from './BasicList.module.css';

export default function BasicList({ listType = 'list', itemType = '', bgColor = 'white', number = 10 }) {
  const swiperRef = useRef(null);
  const recommendedPosts = getFilteredPosts(boardDummy, itemType, number);

  if (!recommendedPosts.length) return null;

  return (
    <>
      {listType === 'slide' && (
        <div className={`
        ${listType === 'slide' ? styles.slideContainer : styles.listContainer}
        ${bgColor === 'black' ? styles.bgBlack : styles.bgWhite}      
      `}>
          <button
            type="button"
            className={styles.buttonPrev}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="이전 슬라이드"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
              <path
                d="M9.49825 19C10.8123 19 12.0473 18.7507 13.2035 18.252C14.3597 17.7533 15.3653 17.0766 16.2205 16.2218C17.0757 15.3669 17.7528 14.3617 18.2518 13.206C18.7506 12.0503 19 10.8156 19 9.50175C19 8.18775 18.7507 6.95267 18.252 5.7965C17.7533 4.64033 17.0766 3.63467 16.2217 2.7795C15.3669 1.92433 14.3617 1.24725 13.206 0.74825C12.0503 0.249417 10.8156 0 9.50175 0C8.18775 0 6.95267 0.249333 5.7965 0.748C4.64033 1.24667 3.63467 1.92342 2.7795 2.77825C1.92433 3.63308 1.24725 4.63833 0.748249 5.794C0.249416 6.94967 0 8.18442 0 9.49825C0 10.8123 0.249332 12.0473 0.747999 13.2035C1.24667 14.3597 1.92342 15.3653 2.77825 16.2205C3.63308 17.0757 4.63833 17.7528 5.794 18.2518C6.94967 18.7506 8.18442 19 9.49825 19ZM8.69425 10.25L10.027 11.5828C10.1653 11.7213 10.2329 11.8937 10.2297 12.1C10.2266 12.3063 10.1558 12.4788 10.0173 12.6173C9.87875 12.7558 9.70417 12.825 9.4935 12.825C9.28283 12.825 9.10933 12.7558 8.973 12.6173L6.4885 10.1328C6.30767 9.95192 6.21725 9.741 6.21725 9.5C6.21725 9.259 6.30767 9.04808 6.4885 8.86725L8.98275 6.373C9.12125 6.23467 9.29367 6.1655 9.5 6.1655C9.70633 6.1655 9.87875 6.23467 10.0173 6.373C10.1558 6.5115 10.225 6.68608 10.225 6.89675C10.225 7.10742 10.1558 7.28092 10.0173 7.41725L8.69425 8.75H12.5C12.7125 8.75 12.8906 8.82192 13.0342 8.96575C13.1781 9.10958 13.25 9.28775 13.25 9.50025C13.25 9.71292 13.1781 9.891 13.0342 10.0345C12.8906 10.1782 12.7125 10.25 12.5 10.25H8.69425Z"
                fill="white"
                fillOpacity="0.2"
              />
            </svg>
          </button>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={16}
            slidesPerView="auto"
            loop={recommendedPosts.length > 1}
            className={styles.swiperWrap}
          >
            {recommendedPosts.map((post, index) => {
              const thumbnail = getThumbnail(post);
              const formattedDate = formatDate(post.date);
              const no = String(index + 1).padStart(2, '0');

              return (
                <SwiperSlide key={post.id} className={styles.swiperSlide}>
                  <div className={styles.swiperItem}>
                    <div className={styles.basicListNo}>{no}</div>
                    <div className={styles.basicListBody}>
                      <Link href={post.url} className={styles.basicListTitle}>
                        {post.name}
                      </Link>
                      <p className={styles.basicListDate}>{formattedDate}</p>
                    </div>
                    <div className={styles.basicListThumb}>
                      <div className={styles.imageBox}>
                        <img src={thumbnail} alt={post.name} />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <button
            type="button"
            className={styles.buttonNext}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="다음 슬라이드"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12.0017 21.5C10.6877 21.5 9.45267 21.2507 8.2965 20.752C7.14033 20.2533 6.13467 19.5766 5.2795 18.7218C4.42433 17.8669 3.74725 16.8617 3.24825 15.706C2.74942 14.5503 2.5 13.3156 2.5 12.0017C2.5 10.6877 2.74933 9.45267 3.248 8.2965C3.74667 7.14033 4.42342 6.13467 5.27825 5.2795C6.13308 4.42433 7.13833 3.74725 8.294 3.24825C9.44967 2.74942 10.6844 2.5 11.9983 2.5C13.3123 2.5 14.5473 2.74933 15.7035 3.248C16.8597 3.74667 17.8653 4.42342 18.7205 5.27825C19.5757 6.13308 20.2528 7.13833 20.7518 8.294C21.2506 9.44967 21.5 10.6844 21.5 11.9983C21.5 13.3123 21.2507 14.5473 20.752 15.7035C20.2533 16.8597 19.5766 17.8653 18.7218 18.7205C17.8669 19.5757 16.8617 20.2528 15.706 20.7518C14.5503 21.2506 13.3156 21.5 12.0017 21.5ZM12.8057 12.75L11.473 14.0828C11.3347 14.2213 11.2671 14.3937 11.2703 14.6C11.2734 14.8063 11.3442 14.9788 11.4827 15.1173C11.6213 15.2558 11.7958 15.325 12.0065 15.325C12.2172 15.325 12.3907 15.2558 12.527 15.1173L15.0115 12.6328C15.1923 12.4519 15.2828 12.241 15.2828 12C15.2828 11.759 15.1923 11.5481 15.0115 11.3673L12.5173 8.873C12.3787 8.73467 12.2063 8.6655 12 8.6655C11.7937 8.6655 11.6213 8.73467 11.4827 8.873C11.3442 9.0115 11.275 9.18608 11.275 9.39675C11.275 9.60742 11.3442 9.78092 11.4827 9.91725L12.8057 11.25H9C8.7875 11.25 8.60942 11.3219 8.46575 11.4658C8.32192 11.6096 8.25 11.7878 8.25 12.0003C8.25 12.2129 8.32192 12.391 8.46575 12.5345C8.60942 12.6782 8.7875 12.75 9 12.75H12.8057Z"
                fill="white"
                fillOpacity="0.2"
              />
            </svg>
          </button>
        </div>
      )}
      {listType === 'list' && (
        <div className={styles.basicList}>
          <ul className={styles.basicListItems}>
            {recommendedPosts.map((post, index) => {
              const thumbnail = getThumbnail(post);
              const formattedDate = formatDate(post.date);
              const no = String(index + 1).padStart(2, '0');
              return (
                <li key={post.id} className={styles.basicListItem}>
                  <Link href={post.url}>
                    <div className={styles.basicListNo}>{no}</div>
                    <div className={styles.basicListBody}>
                      <p className={styles.basicListTitle}>{post.name}</p>
                      <span className={styles.basicListDate}>{formattedDate}</span>
                    </div>
                    <div className={styles.basicListThumb}>
                      <div className={styles.imageBox}>
                        <img src={thumbnail} alt={post.name} />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );

}
