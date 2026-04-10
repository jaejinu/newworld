import Link from 'next/link';
import Image from 'next/image';
import { boardDummy } from '@/lib/constants/boardDummy';
import { formatDate, getThumbnail } from '@/lib/utils/postUtils';
import styles from './HeroSection.module.css';
import BasicList from '@/components/board/basicList/BasicList';

const SITE_NAME = '더원서울안과 공식 블로그';

function getEditorPickPost() {
  const sorted = [...boardDummy]
    .filter((post) => post.editorPick === true)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted[0] ?? null;
}

export default function HeroSection() {
  const post = getEditorPickPost();

  if (!post) return null;

  const thumbnail = getThumbnail(post);
  const formattedDate = formatDate(post.date);

  return (
    <section className={styles.hero}>
      <div className={`${styles.heroInner} section-inner`}>
        <article className={styles.heroFeature}>
          <div className={styles.heroFeatureMain}>
            <Link href={post.url} className={styles.heroFeatureImage}>
              <Image
                src={thumbnail}
                alt={post.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 680px"
                style={{ objectFit: 'cover' }}
              />
            </Link>
            <div className={styles.heroFeatureText}>
              {post.categoryName && (
                <div className={styles.heroFeatureLabel}>{post.categoryName}</div>
              )}
              <h1 className={styles.heroFeatureTitle}>
                <Link href={post.url}>{post.name}</Link>
              </h1>
              <div className={styles.heroFeatureInfo}>
                <div className={styles.heroFeatureAuthor}>
                  <div className={styles.heroFeatureAuthorImg} />
                  <div className={styles.heroFeatureAuthorInfo}>
                    <p className={styles.heroFeatureAuthorName}>{SITE_NAME}</p>
                    <p className={styles.heroFeatureDate}>{formattedDate}</p>
                  </div>
                </div>
                <div className={styles.heroFeatureActions}>
                  <Link
                    href="/"
                    className={styles.heroActionBtn}
                    aria-label="댓글"
                  >
                    <span className={styles.heroActionIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 7.5H10.1667V6.5H2.5V7.5ZM2.5 5.5H10.1667V4.5H2.5V5.5ZM2.5 3.5H10.1667V2.5H2.5V3.5ZM12.6667 12.359L10.3077 10H1.20517C0.868389 10 0.583333 9.88333 0.35 9.65C0.116667 9.41667 0 9.13161 0 8.79483V1.20517C0 0.868389 0.116667 0.583333 0.35 0.35C0.583333 0.116667 0.868389 0 1.20517 0H11.4615C11.7983 0 12.0833 0.116667 12.3167 0.35C12.55 0.583333 12.6667 0.868389 12.6667 1.20517V12.359ZM1.20517 9H10.7333L11.6667 9.92317V1.20517C11.6667 1.15383 11.6453 1.10683 11.6025 1.06417C11.5598 1.02139 11.5128 1 11.4615 1H1.20517C1.15383 1 1.10683 1.02139 1.06417 1.06417C1.02139 1.10683 1 1.15383 1 1.20517V8.79483C1 8.84617 1.02139 8.89317 1.06417 8.93583C1.10683 8.97861 1.15383 9 1.20517 9Z" fill="#fff" />
                      </svg>
                    </span>
                    <p className={styles.heroActionText}>0 댓글</p>
                  </Link>
                  <Link
                    href={post.url}
                    className={`${styles.heroActionBtn} ${styles.heroActionLink}`}
                    aria-label="링크 이동"
                  >
                    <span className={styles.heroActionIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M8.12683 1.7025L0.847333 8.982C0.755 9.07433 0.639 9.12155 0.499333 9.12367C0.359556 9.12578 0.241389 9.07856 0.144833 8.982C0.0482778 8.88544 0 8.76839 0 8.63083C0 8.49317 0.0482778 8.37606 0.144833 8.2795L7.42433 1H3.2935C3.15183 1 3.03306 0.952055 2.93717 0.856167C2.84139 0.760278 2.7935 0.6415 2.7935 0.499833C2.7935 0.358055 2.84139 0.239333 2.93717 0.143667C3.03306 0.0478888 3.15183 0 3.2935 0H8.52417C8.69494 0 8.83805 0.0577782 8.9535 0.173334C9.06905 0.288778 9.12683 0.431888 9.12683 0.602666V5.83333C9.12683 5.975 9.07889 6.09378 8.983 6.18967C8.88711 6.28544 8.76833 6.33333 8.62667 6.33333C8.48489 6.33333 8.36617 6.28544 8.2705 6.18967C8.17472 6.09378 8.12683 5.975 8.12683 5.83333V1.7025Z" fill="white" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
        <BasicList bgColor="white" listType="list" itemType="" number={3}  />
      </div>
    </section>
  );
}