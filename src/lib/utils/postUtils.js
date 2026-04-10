/**
 * 게시글 관련 공통 유틸리티
 */

export const NO_IMAGE = '/images/icon/ico-img.svg';

export const VALID_ITEM_TYPES = ['recommended', 'noticePost', 'editorPick'];

/**
 * 날짜 문자열을 'YYYY년 M월 D일' 형식으로 변환
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}년 ${m}월 ${day}일`;
}

/**
 * 게시글에서 썸네일 이미지 URL 추출 (thumbnail > content 첫 이미지 > NO_IMAGE)
 */
export function getThumbnail(post) {
  if (post?.thumbnail) return post.thumbnail;
  const match = post?.content?.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1] || NO_IMAGE;
}

/**
 * itemType에 따라 게시글 필터링 후 최신순 정렬
 * @param {number} [number] - 반환할 개수. 생략 시 전체 반환
 */
export function getFilteredPosts(posts, itemType, number) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  let result;
  if (!itemType || !VALID_ITEM_TYPES.includes(itemType)) {
    result = sorted;
  } else {
    result = sorted.filter((post) => post[itemType] === true);
  }

  return number != null ? result.slice(0, number) : result;
}
