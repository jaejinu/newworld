'use client';

import { useState, useMemo } from 'react';
import PostList from '@/components/board/postList/postList';
import Pagination from '@/components/board/pagination/Pagination';
import { boardDummy } from '@/lib/constants/boardDummy';
import { getFilteredPosts } from '@/lib/utils/postUtils';
import styles from './LatestPostSection.module.css';
import BasicList from '@/components/board/basicList/BasicList';
import AdBanner from '@/components/adBanner/adBanner';
import Link from 'next/link';

const PER_PAGE = 5;

export default function LatestPostSection() {
    const [page, setPage] = useState(1);
    const allPosts = useMemo(() => getFilteredPosts(boardDummy, 'latestPost'), []);
    const currentPosts = allPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const totalPages = Math.ceil(allPosts.length / PER_PAGE);

    return (
        <section className={styles.latestPostSection}>
            <div className="section-inner feed-grid">
                <div className="feed-main">
                    <div className="section-head">
                        <div className="section-left">
                            <span className="flag-type blue">방금 업로드📌</span>
                        </div>
                        <Link href="/search" className="text-link">
                            <div>View More</div>
                        </Link>
                        <div className="line"></div>
                    </div>
                    <PostList type="row" itemType="latestPost" hasDesc posts={currentPosts} />
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} maxVisible={5} />
                </div>
                <div className="sticky-area">
                    <div className="side-card-head">
                        <div className="section-left">
                            <span className="flag-type sky">실시간 인기글🔥</span>
                        </div>                                               
                    </div>
                    <BasicList bgColor="black" listType="list" itemType="" number={1}  />
                    <AdBanner />
                </div>
            </div>
        </section>
    )
}