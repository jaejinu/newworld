'use client';

import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisible = 5 }) {
  if (totalPages <= 1) return null;

  const currentGroupIndex = Math.floor((currentPage - 1) / maxVisible);
  const startPage = currentGroupIndex * maxVisible + 1;
  const endPage = Math.min(startPage + maxVisible - 1, totalPages);
  const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const prevGroupStart = Math.max(1, (currentGroupIndex - 1) * maxVisible + 1);
  const nextGroupStart = Math.min(totalPages, (currentGroupIndex + 1) * maxVisible + 1);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.pagination}>
      {currentPage !== 1 && (
        <>
          <button className={styles.pageBtn} onClick={() => onPageChange(prevGroupStart)} aria-label="이전 그룹">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(180deg)' }}>
              <path d="M3 2L11 10L3 18" stroke="#333333" strokeWidth="2" strokeLinecap="round"></path>
              <path d="M9 2L17 10L9 18" stroke="#333333" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </button>
          <button className={styles.pageBtn} onClick={handlePrev} aria-label="이전 페이지">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(180deg)' }}>
              <path d="M6 2L14 10L6 18" stroke="#333333" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </button>
        </>
      )}
      <ul className={styles.pageList}>
        {pagesToShow.map((pageNum) => (
          <li key={pageNum}>
            <button
              type="button"
              className={`${currentPage === pageNum ? styles.isActive : ""} ${styles.pageNum}`}
              onClick={() => onPageChange(pageNum)}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          </li>
        ))}
      </ul>
      {currentPage !== totalPages && (
        <>
          <button className={styles.pageBtn} onClick={handleNext} aria-label="다음 페이지">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 2L14 10L6 18" stroke="#333333" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </button>
          <button className={styles.pageBtn} onClick={() => onPageChange(nextGroupStart)} aria-label="다음 그룹">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 2L11 10L3 18" stroke="#333333" strokeWidth="2" strokeLinecap="round"></path>
              <path d="M9 2L17 10L9 18" stroke="#333333" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
