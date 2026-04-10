'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getBreadcrumb } from '@/lib/utils/menuUtils';
import styles from './subTop.module.css';
import Breadcrumb from '../breadcrumb/Breadcrumb';

const MOBILE_BREAKPOINT = 768;

const SUB_TOP_BACKGROUNDS = {
  '/eye-story/deep-eye-stories': { type: 'image', src: '/images/sub/sub-01.png', srcMobile: '/images/sub/sub-01-mo.png' },
  '/eye-story/silent-vision-thief': { type: 'image', src: '/images/sub/sub-03.png', srcMobile: '/images/sub/sub-02-mo.png' },
  '/eye-story/restore-clarity': { type: 'image', src: '/images/sub/sub-04.png', srcMobile: '/images/sub/sub-03-mo.png' },
  '/eye-story/glasses-free-tech': { type: 'image', src: '/images/sub/sub-04.png', srcMobile: '/images/sub/sub-04-mo.png' },
  '/eye-story/distant-world-close-view': { type: 'image', src: '/images/sub/sub-05.jpg', srcMobile: '/images/sub/sub-05-mo.png' },
  '/eye-story/eye-health-report': { type: 'image', src: '/images/sub/sub-06.png', srcMobile: '/images/sub/sub-06-mo.png' },
  '/medical-team-stories': { type: 'image', src: '/images/sub/sub-07.png', srcMobile: '/images/sub/sub-07-mo.png' },
  '/member-stories': { type: 'image', src: '/images/sub/sub-08.jpg', srcMobile: '/images/sub/sub-08-mo.png' },
  '/patient-stories': { type: 'image', src: '/images/sub/sub-09.png', srcMobile: '/images/sub/sub-09-mo.png' },
  '/center-news': { type: 'video', src: '/images/sub/sub-10.mp4', srcMobile: '/images/sub/sub-10.mp4' },
};

const DEFAULT_BACKGROUND = { type: 'image', src: '/images/sub/default.jpg', srcMobile: '/images/sub/default-mo.jpg' };

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
    <path d="M1 14.3845H4.69225V9.3075C4.69225 9.07867 4.76967 8.88683 4.9245 8.732C5.07933 8.57733 5.27117 8.5 5.5 8.5H8.5C8.72883 8.5 8.92067 8.57733 9.0755 8.732C9.23033 8.88683 9.30775 9.07867 9.30775 9.3075V14.3845H13V5.69225C13 5.58958 12.9776 5.49658 12.9327 5.41325C12.8879 5.32992 12.827 5.25625 12.75 5.19225L7.3655 1.1345C7.26283 1.04483 7.141 1 7 1C6.859 1 6.73717 1.04483 6.6345 1.1345L1.25 5.19225C1.173 5.25625 1.11208 5.32992 1.06725 5.41325C1.02242 5.49658 1 5.58958 1 5.69225V14.3845ZM0 14.3845V5.69225C0 5.43642 0.0572499 5.19408 0.17175 4.96525C0.286083 4.73642 0.44425 4.548 0.64625 4.4L6.03075 0.323C6.31258 0.107666 6.63467 0 6.997 0C7.35933 0 7.68342 0.107666 7.96925 0.323L13.3538 4.4C13.5558 4.548 13.7139 4.73642 13.8282 4.96525C13.9427 5.19408 14 5.43642 14 5.69225V14.3845C14 14.6525 13.9003 14.8862 13.701 15.0855C13.5017 15.2848 13.268 15.3845 13 15.3845H9.1155C8.8865 15.3845 8.69467 15.3071 8.54 15.1523C8.38517 14.9974 8.30775 14.8056 8.30775 14.5768V9.5H5.69225V14.5768C5.69225 14.8056 5.61483 14.9974 5.46 15.1523C5.30533 15.3071 5.1135 15.3845 4.8845 15.3845H1C0.732 15.3845 0.498334 15.2848 0.299 15.0855C0.0996668 14.8862 0 14.6525 0 14.3845Z" fill="white" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="8" viewBox="0 0 4 8" fill="none">
    <path d="M3.30564 3.75L0.0909543 0.535208C0.029496 0.473819 -0.000816611 0.4 1.67223e-05 0.31375C0.000780611 0.22743 0.0318916 0.153576 0.09335 0.0921872C0.154739 0.0307289 0.228593 0 0.314913 0C0.401163 0 0.475017 0.0307289 0.536475 0.0921872L3.71835 3.27646C3.78564 3.34375 3.83477 3.41878 3.86575 3.50156C3.89672 3.58441 3.9122 3.66722 3.9122 3.75C3.9122 3.83278 3.89672 3.91559 3.86575 3.99844C3.83477 4.08121 3.78564 4.15625 3.71835 4.22354L0.533975 7.40781C0.472586 7.46927 0.399149 7.49958 0.313663 7.49875C0.228177 7.49799 0.154739 7.46687 0.09335 7.40542C0.0318916 7.34403 0.00116272 7.27017 0.00116272 7.18385C0.00116272 7.0976 0.0318916 7.02375 0.09335 6.96229L3.30564 3.75Z" fill="white" />
  </svg>
);

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
}

export default function SubTop() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isListPage = pathname in SUB_TOP_BACKGROUNDS;
  if (!isListPage) return null;

  const breadcrumb = getBreadcrumb(pathname);
  const bgConfig = SUB_TOP_BACKGROUNDS[pathname];
  const bgSrc = isMobile && bgConfig.srcMobile ? bgConfig.srcMobile : bgConfig.src;

  return (
    <section className={styles.subTop}>
      {bgConfig.type === 'video' ? (
        <video
          className={styles.bgMedia}
          autoPlay
          muted
          loop
          playsInline
          src={bgSrc}
          key={bgSrc}
          aria-hidden
        />
      ) : (
        <div className={styles.bgImage} style={{ backgroundImage: `url(${bgSrc})` }} aria-hidden />
      )}
      <div className={styles.bgOverlay} aria-hidden />
      <div className="section-inner">
        <div className={styles.txtWrap}>
          <Breadcrumb items={breadcrumb} className="white" />          
          <h2 className={styles.subTitle}>{breadcrumb[breadcrumb.length - 1].name}</h2>
        </div>
      </div>
    </section>
  );
}
