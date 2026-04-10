/**
 * boardDummy content 변환:
 * 1. 이미지 블록 → { type: 'image', src, alt, width?, height? } (src는 /dummy_img 경로)
 * 2. 나머지 → { type: 'html', html } (img src도 /dummy_img로 치환)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WP_UPLOADS = 'https://theoneblog.mycafe24.com/wp-content/uploads/';
const DUMMY_IMG = '/dummy_img/';

function toDummyPath(url) {
    if (!url || !url.includes('wp-content/uploads/')) return url;
    return url.replace(WP_UPLOADS, DUMMY_IMG).replace(/&amp;/g, '&');
}

function parseImgFromHtml(html) {
    const srcMatch = html.match(/<img[^>]+src="([^"]+)"/);
    if (!srcMatch) return null;
    const src = toDummyPath(srcMatch[1]);
    const altMatch = html.match(/alt="([^"]*)"/);
    const alt = altMatch ? altMatch[1] : '';
    const styleMatch = html.match(/style="[^"]*width:(\d+)px/);
    const widthFromStyle = styleMatch ? parseInt(styleMatch[1], 10) : null;
    const dimMatch = srcMatch[1].match(/-(\d+)x(\d+)\.(png|jpg|jpeg|webp)$/i);
    const width = widthFromStyle || (dimMatch ? parseInt(dimMatch[1], 10) : undefined);
    const height = dimMatch ? parseInt(dimMatch[2], 10) : undefined;
    return { src, alt, width, height };
}

function isSimpleFigureWithImg(html) {
    const trimmed = html.trim();
    if (!trimmed.startsWith('<figure') || !trimmed.includes('<img')) return false;
    const imgCount = (trimmed.match(/<img/g) || []).length;
    return imgCount === 1 && !trimmed.includes('wp-block-media-text') && !trimmed.includes('wp-block-pullquote');
}

function processContentItem(item) {
    if (typeof item !== 'string') return item;

    if (isSimpleFigureWithImg(item)) {
        const img = parseImgFromHtml(item);
        if (img) {
            return { type: 'image', src: img.src, alt: img.alt, width: img.width, height: img.height };
        }
    }

    const replacedHtml = item.replace(
        /src="https:\/\/theoneblog\.mycafe24\.com\/wp-content\/uploads\/([^"]+)"/g,
        (_, p) => `src="${DUMMY_IMG}${p.replace(/&amp;/g, '&')}"`
    );
    return { type: 'html', html: replacedHtml };
}

const { boardDummy } = await import('../src/lib/constants/boardDummy.js');

const converted = boardDummy.map((post) => ({
    ...post,
    content: post.content.map(processContentItem),
}));

const output = `/*
    게시글 더미 데이터 (WordPress export 기반)
    - content: map 가능한 블록 배열 (type: 'image' | 'html')
    - image: { type, src, alt, width?, height? } → Next.js Image 등으로 렌더
    - html: { type, html } → dangerouslySetInnerHTML
*/
export const boardDummy = ${JSON.stringify(converted, null, 2)};
`;

const outPath = path.join(__dirname, '../src/lib/constants/boardDummy.js');
fs.writeFileSync(outPath, output, 'utf8');
console.log('변환 완료:', outPath);
