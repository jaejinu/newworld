import { boardDummy } from '@/lib/constants/boardDummy';

/**
 * URL 슬러그로 게시글 찾기
 */
export function getPostBySlug(categorySlug, viewSlug) {
  return boardDummy.find((post) => {
    const urlSegments = post.url.split('/').filter(Boolean);
    const postSlug = urlSegments[urlSegments.length - 1];
    return post.categorySlug === categorySlug && postSlug === viewSlug;
  }) ?? null;
}

/**
 * 같은 카테고리 내 이전/다음 게시글 반환
 */
export function getAdjacentPosts(post) {
  if (!post) return { prev: null, next: null };

  const sameCategoryPosts = boardDummy
    .filter((p) => p.categorySlug === post.categorySlug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentIndex = sameCategoryPosts.findIndex((p) => p.id === post.id);

  return {
    prev: currentIndex < sameCategoryPosts.length - 1 ? sameCategoryPosts[currentIndex + 1] : null,
    next: currentIndex > 0 ? sameCategoryPosts[currentIndex - 1] : null,
  };
}
