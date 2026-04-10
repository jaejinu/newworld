/**
 * WordPress Gutenberg 블록 HTML을 파싱하여 구조화된 블록 배열로 변환
 * @param {string} html - WordPress content HTML
 * @returns {Array<{type: string, attrs?: object, html: string}>}
 */
export function parseWpBlocks(html) {
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
                } catch {
                    // attrs 파싱 실패 시 무시
                }
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
            attrs: Object.keys(attrs).length > 0 ? attrs : undefined,
            html: content,
        });

        pos = contentEnd !== -1 ? contentEnd + closingComment.length : html.length;
    }

    return blocks;
}

/**
 * 블록 배열을 HTML 문자열로 합침 (기존 content 문자열 형태로 복원)
 * @param {Array<{type: string, attrs?: object, html: string}>} blocks
 * @returns {string}
 */
export function blocksToHtml(blocks) {
    if (!Array.isArray(blocks)) return '';
    return blocks.map((b) => b.html).join('\n\n');
}

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
