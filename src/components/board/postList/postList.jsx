'use client';

import Link from 'next/link';
import { boardDummy } from '@/lib/constants/boardDummy';
import { formatDate, getThumbnail, getFilteredPosts } from '@/lib/utils/postUtils';
import styles from './postList.module.css';

const SITE_NAME = '더원서울안과 공식 블로그';

function getExcerpt(post, maxLength = 100) {
  if (!post?.content) return '';
  const text = post.content.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export default function PostList({ type = 'row', itemType = 'editorPick', number = 3, hasDesc = false, category = '', posts: postsProp }) {
  const sourcePosts = category ? boardDummy.filter((post) => post.categorySlug === category) : boardDummy;
  const posts = postsProp ?? getFilteredPosts(sourcePosts, itemType, number);

  if (!posts.length) {
    return (
      <ul className={styles.postList}>
        <li className={`${styles.postRow} ${styles.noEmpty}`}>
          <p>등록된 게시글이 없습니다.</p>
        </li>
      </ul>
    );
  }

  return (
    <ul className={`${styles.postList} ${type === 'column' ? styles.column : ''}`}>
      {posts.map((post) => {
        const thumbnail = getThumbnail(post);
        const hasImage = thumbnail && !thumbnail.includes('ico-img');
        const formattedDate = formatDate(post.date);

        return (
          <li key={post.id} className={styles.postRow}>
            <Link href={post.url}>
              <div className={`${styles.postRowImg} ${!hasImage ? styles.noImage : ''}`}>
                <img src={thumbnail} alt={post.name} />
              </div>
              <div className={styles.postRowBody}>
                {post.categoryName && (
                  <div className={styles.postRowLabel}>{post.categoryName}</div>
                )}
                <h3 className={styles.postRowTitle}>{post.name}</h3>
                {hasDesc && getExcerpt(post) && (
                  <div className={styles.postRowDesc}>
                    <p>{getExcerpt(post)}</p>
                  </div>
                )}
                <div className={styles.postRowInfo}>
                  <div className={styles.postRowAuthor}>
                    <span className={styles.postRowAuthorImg}>
                      <img src="/images/common/logo-small.svg" alt={SITE_NAME} />
                    </span>
                    <div>
                      <p className={styles.postRowAuthorName}>{SITE_NAME}</p>
                      <p className={styles.postRowDate}>{formattedDate}</p>
                    </div>
                  </div>
                  <div className={styles.postRowActions}>
                    <button
                      type="button"
                      className={styles.postActionBtn}
                      aria-label="공유"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (navigator.share) {
                          navigator.share({
                            title: post.name,
                            url: window.location.origin + post.url,
                          });
                        }
                      }}
                    >
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                          <path d="M9.537 12.6667C9.038 12.6667 8.61433 12.4922 8.266 12.1432C7.91778 11.7942 7.74367 11.3704 7.74367 10.8718C7.74367 10.8052 7.76672 10.6432 7.81283 10.3858L3.07183 7.59483C2.91117 7.7615 2.72028 7.89206 2.49917 7.9865C2.27806 8.08095 2.04117 8.12817 1.7885 8.12817C1.29172 8.12817 0.869444 7.95294 0.521667 7.6025C0.173889 7.25206 0 6.829 0 6.33333C0 5.83767 0.173889 5.41461 0.521667 5.06417C0.869444 4.71372 1.29172 4.5385 1.7885 4.5385C2.04117 4.5385 2.27806 4.58572 2.49917 4.68017C2.72028 4.77461 2.91117 4.90517 3.07183 5.07183L7.81283 2.28717C7.78639 2.20517 7.76822 2.12483 7.75833 2.04617C7.74856 1.9675 7.74367 1.88372 7.74367 1.79483C7.74367 1.29628 7.91828 0.8725 8.2675 0.5235C8.61683 0.1745 9.041 0 9.54 0C10.039 0 10.4626 0.174667 10.8108 0.524C11.1592 0.873222 11.3333 1.29733 11.3333 1.79633C11.3333 2.29533 11.1588 2.719 10.8098 3.06733C10.4608 3.41556 10.0371 3.58967 9.5385 3.58967C9.28461 3.58967 9.0485 3.54139 8.83017 3.44483C8.61172 3.34828 8.42217 3.21667 8.2615 3.05L3.5205 5.841C3.54694 5.92311 3.56511 6.00345 3.575 6.082C3.58478 6.16067 3.58967 6.24444 3.58967 6.33333C3.58967 6.42222 3.58478 6.506 3.575 6.58467C3.56511 6.66322 3.54694 6.74356 3.5205 6.82567L8.2615 9.61667C8.42217 9.45 8.61172 9.31839 8.83017 9.22183C9.0485 9.12528 9.28461 9.077 9.5385 9.077C10.0371 9.077 10.4608 9.25161 10.8098 9.60083C11.1588 9.95017 11.3333 10.3743 11.3333 10.8733C11.3333 11.3723 11.1587 11.7959 10.8093 12.1442C10.4601 12.4925 10.036 12.6667 9.537 12.6667Z" fill="#404040" />
                        </svg>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={styles.postActionBtn}
                      aria-label="외부 링크"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(post.url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.3334 5.36925L4.05388 12.6487C3.96154 12.7411 3.84554 12.7883 3.70588 12.7904C3.5661 12.7925 3.44793 12.7453 3.35138 12.6487C3.25482 12.5522 3.20654 12.4351 3.20654 12.2976C3.20654 12.1599 3.25482 12.0428 3.35138 11.9462L10.6309 4.66675H6.50004C6.35838 4.66675 6.2396 4.6188 6.14371 4.52291C6.04793 4.42703 6.00004 4.30825 6.00004 4.16658C6.00004 4.0248 6.04793 3.90608 6.14371 3.81041C6.2396 3.71464 6.35838 3.66675 6.50004 3.66675H11.7307C11.9015 3.66675 12.0446 3.72453 12.16 3.84008C12.2756 3.95553 12.3334 4.09864 12.3334 4.26941V9.50008C12.3334 9.64175 12.2854 9.76053 12.1895 9.85641C12.0937 9.95219 11.9749 10.0001 11.8332 10.0001C11.6914 10.0001 11.5727 9.95219 11.477 9.85641C11.3813 9.76053 11.3334 9.64175 11.3334 9.50008V5.36925Z" fill="#404040" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
