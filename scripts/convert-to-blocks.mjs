/**
 * boardDummy의 content 문자열을 parseWpBlocks로 블록 배열로 변환하여 새 파일 생성
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// parseWpBlocks 로직 (Node에서 직접 사용)
function findMatchingBrace(str, openIndex) {
    if (str[openIndex] !== '{') return -1;
    let depth = 0;
    for (let i = openIndex; i < str.length; i++) {
        if (str[i] === '{') depth++;
        else if (str[i] === '}') {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

function parseWpBlocks(html) {
    if (!html || typeof html !== 'string') return [];
    const blocks = [];
    const openTag = '<!-- wp:';
    let pos = 0;

    while ((pos = html.indexOf(openTag, pos)) !== -1) {
        const afterOpen = html.slice(pos + openTag.length);
        const typeMatch = afterOpen.match(/^([\w-]+)\s*/);
        if (!typeMatch) {
            pos += 1;
            continue;
        }

        const type = typeMatch[1];
        let attrEnd = typeMatch[0].length;
        let attrs = {};

        const rest = afterOpen.slice(attrEnd).trim();
        let searchFrom = pos + openTag.length + attrEnd;
        if (rest.startsWith('{')) {
            const braceStart = html.indexOf('{', pos + openTag.length);
            const jsonEnd = findMatchingBrace(html, braceStart);
            if (jsonEnd !== -1) {
                try {
                    const jsonStr = html
                        .slice(braceStart, jsonEnd + 1)
                        .replace(/&amp;/g, '&');
                    attrs = JSON.parse(jsonStr);
                } catch {}
                searchFrom = jsonEnd + 1;
            }
        }

        const endOpenComment = html.indexOf('-->', searchFrom);
        if (endOpenComment === -1) {
            pos += 1;
            continue;
        }

        const contentStart = endOpenComment + 3;
        const closingComment = `<!-- /wp:${type} -->`;
        const contentEnd = html.indexOf(closingComment, contentStart);
        const content =
            contentEnd !== -1
                ? html.slice(contentStart, contentEnd).trim()
                : html.slice(contentStart).trim();

        blocks.push({
            type,
            ...(Object.keys(attrs).length > 0 && { attrs }),
            html: content,
        });

        pos = contentEnd !== -1 ? contentEnd + closingComment.length : html.length;
    }

    return blocks;
}

// boardDummy는 CJS로 로드 (Next.js 프로젝트)
const { boardDummy } = await import('../src/lib/constants/boardDummy.js');

// content가 이미 블록 배열이면 html만 추출, 문자열이면 파싱 후 html만 추출
const converted = boardDummy.map((post) => {
    const blocks = Array.isArray(post.content)
        ? post.content
        : parseWpBlocks(post.content);
    const tags = blocks.map((b) => (typeof b === 'string' ? b : b.html));
    return { ...post, content: tags };
});

const output = `/*
    게시글 더미 데이터 (WordPress export 기반, content는 HTML 태그 배열)
*/
export const boardDummy = ${JSON.stringify(converted, null, 2)};
`;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/lib/constants/boardDummy.js');
fs.writeFileSync(outPath, output, 'utf8');
console.log('변환 완료:', outPath);
