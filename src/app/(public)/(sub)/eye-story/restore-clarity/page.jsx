'use client';
import PostList from '@/components/board/postList/postList';
import styles from '../../page.module.css';
import Pagination from '@/components/board/pagination/Pagination';
import BasicList from '@/components/board/basicList/BasicList';
import AdBanner from '@/components/adBanner/adBanner';
import { boardDummy } from '@/lib/constants/boardDummy';
import { getFilteredPosts } from '@/lib/utils/postUtils';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const PER_PAGE = 5;
const CATEGORY = 'restore-clarity';

export default function RestoreClarity() {
    const [page, setPage] = useState(1);
    const allPosts = useMemo(() => {
        const source = boardDummy.filter((post) => post.categorySlug === CATEGORY);
        return getFilteredPosts(source, 'latestPost');
    }, []);
    const currentPosts = allPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const totalPages = Math.ceil(allPosts.length / PER_PAGE);
  return (
    <section className={styles.section}>
        <div className="section-inner feed-grid">
            <div className="feed-main">
                <div className="section-head">
                    <div className="section-left">
                        <span className="flag-type blue">방금 업로드📌</span>
                    </div>                    
                    <div className="line"></div>
                </div>
                <PostList type="row" itemType="latestPost" hasDesc category="deep-eye-stories" posts={currentPosts} />
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} maxVisible={5} />
            </div>
            <div className="sticky-area">
                <div className="side-card-head">
                    <div className="section-left">
                        <span className="flag-type sky">게시판 공지글 ⭐</span>
                    </div>                                               
                </div>
                <BasicList bgColor="black" listType="list" itemType="noticePost" number={1}  />
                <AdBanner />
            </div>
        </div>
    </section>
  );
}