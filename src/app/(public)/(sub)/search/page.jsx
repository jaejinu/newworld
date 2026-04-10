'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../page.module.css';
import PostList from '@/components/board/postList/postList';
import Pagination from '@/components/board/pagination/Pagination';
import BasicList from '@/components/board/basicList/BasicList';
import AdBanner from '@/components/adBanner/adBanner';
import { boardDummy } from '@/lib/constants/boardDummy';
import { getFilteredPosts } from '@/lib/utils/postUtils';

const PER_PAGE = 5;

function normalize(str) {
  return (str ?? '').toString().toLowerCase();
}

function stripHtml(html) {
  return (html ?? '').toString().replace(/<[^>]*>/g, ' ');
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();
  const type = (searchParams.get('type') ?? '').trim();

  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [q, type]);

  const results = useMemo(() => {
    if (type === 'editorPick') {
      return getFilteredPosts(boardDummy, 'editorPick');
    }

    if (!q) return [];
    const keyword = normalize(q);
    const source = getFilteredPosts(boardDummy, 'latestPost');
    return source.filter((post) => {
      const title = normalize(post.name);
      const body = normalize(stripHtml(post.content));
      return title.includes(keyword) || body.includes(keyword);
    });
  }, [q, type]);

  const totalPages = Math.ceil(results.length / PER_PAGE) || 1;
  const currentPosts = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className={styles.section}>
      <div className="section-inner feed-grid">
        <div className="feed-main">
          <div className="section-head">
            <div className="section-left">
              <span className="flag-type blue">{type === 'editorPick' ? '에디터픽' : '검색 결과'} 목록📌</span>
            </div>
            <div className="line" />
          </div>

          {type === 'editorPick' ? (
            <>              
              <PostList type="row" itemType="latestPost" hasDesc posts={currentPosts} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} maxVisible={5} />
            </>
          ) : q ? (
            <>              
              <PostList type="row" itemType="latestPost" hasDesc posts={currentPosts} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} maxVisible={5} />
            </>
          ) : (
            <p className="no-empty">검색어를 입력해주세요.</p>
          )}
        </div>

        <div className="sticky-area">
          <div className="side-card-head">
            <div className="section-left">
              <span className="flag-type sky">게시판 공지글 ⭐</span>
            </div>
          </div>
          <BasicList bgColor="black" listType="list" itemType="noticePost" number={1} />
          <AdBanner />
        </div>
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<section className={styles.section}><p className="no-empty">불러오는 중…</p></section>}>
      <SearchPageContent />
    </Suspense>
  );
}

