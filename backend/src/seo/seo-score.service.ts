import { Injectable } from '@nestjs/common';

export interface Check {
  name: string;
  passed: boolean;
  points: number;
  maxPoints: number;
  advice: string;
}

export interface ScoreResult {
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  details: {
    seo: Check[];
    aeo: Check[];
    geo: Check[];
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const MEDICAL_TERMS = [
  '눈', '시력', '안과', '수술', '렌즈', '각막', '망막', '녹내장', '백내장',
  '라식', '라섹', '드림렌즈', '안압', '안구', '시야', '황반', '결막',
  '난시', '근시', '원시', '노안', '비문증', '안검', '눈물',
];

@Injectable()
export class SeoScoreService {
  calculateScores(
    post: { content: string; slug: string; title: string },
    seoMeta: any,
  ): ScoreResult {
    const seoChecks = this.calculateSeoChecks(post, seoMeta);
    const aeoChecks = this.calculateAeoChecks(post, seoMeta);
    const geoChecks = this.calculateGeoChecks(post, seoMeta);

    const seoScore = seoChecks.reduce((sum, c) => sum + c.points, 0);
    const aeoScore = aeoChecks.reduce((sum, c) => sum + c.points, 0);
    const geoScore = geoChecks.reduce((sum, c) => sum + c.points, 0);

    return {
      seoScore,
      aeoScore,
      geoScore,
      details: {
        seo: seoChecks,
        aeo: aeoChecks,
        geo: geoChecks,
      },
    };
  }

  // ─── SEO Checks (20 x 5pts = 100) ───

  private calculateSeoChecks(
    post: { content: string; slug: string; title: string },
    seo: any,
  ): Check[] {
    const content = post.content || '';
    const plainText = stripHtml(content);
    const wordCount = countWords(plainText);
    const focusKeyword = seo?.focusKeyword || '';

    const checks: Check[] = [];

    // 1. titleLength
    const titleLen = (seo?.metaTitle || '').length;
    checks.push({
      name: 'titleLength',
      passed: titleLen >= 30 && titleLen <= 60,
      points: titleLen >= 30 && titleLen <= 60 ? 5 : 0,
      maxPoints: 5,
      advice: titleLen >= 30 && titleLen <= 60
        ? '메타 타이틀 길이가 적절합니다.'
        : `메타 타이틀이 ${titleLen}자입니다. 30-60자 사이로 조정하세요.`,
    });

    // 2. titleKeyword
    const titleHasKeyword =
      !!focusKeyword &&
      (seo?.metaTitle || '').toLowerCase().includes(focusKeyword.toLowerCase());
    checks.push({
      name: 'titleKeyword',
      passed: titleHasKeyword,
      points: titleHasKeyword ? 5 : 0,
      maxPoints: 5,
      advice: titleHasKeyword
        ? '메타 타이틀에 포커스 키워드가 포함되어 있습니다.'
        : '메타 타이틀에 포커스 키워드를 포함하세요.',
    });

    // 3. descriptionLength
    const descLen = (seo?.metaDescription || '').length;
    checks.push({
      name: 'descriptionLength',
      passed: descLen >= 120 && descLen <= 160,
      points: descLen >= 120 && descLen <= 160 ? 5 : 0,
      maxPoints: 5,
      advice: descLen >= 120 && descLen <= 160
        ? '메타 디스크립션 길이가 적절합니다.'
        : `메타 디스크립션이 ${descLen}자입니다. 120-160자 사이로 조정하세요.`,
    });

    // 4. descriptionKeyword
    const descHasKeyword =
      !!focusKeyword &&
      (seo?.metaDescription || '').toLowerCase().includes(focusKeyword.toLowerCase());
    checks.push({
      name: 'descriptionKeyword',
      passed: descHasKeyword,
      points: descHasKeyword ? 5 : 0,
      maxPoints: 5,
      advice: descHasKeyword
        ? '메타 디스크립션에 포커스 키워드가 포함되어 있습니다.'
        : '메타 디스크립션에 포커스 키워드를 포함하세요.',
    });

    // 5. ogTitle
    const hasOgTitle = !!(seo?.ogTitle);
    checks.push({
      name: 'ogTitle',
      passed: hasOgTitle,
      points: hasOgTitle ? 5 : 0,
      maxPoints: 5,
      advice: hasOgTitle
        ? 'OG 타이틀이 설정되어 있습니다.'
        : 'OG 타이틀을 설정하세요.',
    });

    // 6. ogDescription
    const hasOgDesc = !!(seo?.ogDescription);
    checks.push({
      name: 'ogDescription',
      passed: hasOgDesc,
      points: hasOgDesc ? 5 : 0,
      maxPoints: 5,
      advice: hasOgDesc
        ? 'OG 디스크립션이 설정되어 있습니다.'
        : 'OG 디스크립션을 설정하세요.',
    });

    // 7. ogImage
    const hasOgImage = !!(seo?.ogImage);
    checks.push({
      name: 'ogImage',
      passed: hasOgImage,
      points: hasOgImage ? 5 : 0,
      maxPoints: 5,
      advice: hasOgImage
        ? 'OG 이미지가 설정되어 있습니다.'
        : 'OG 이미지를 설정하세요.',
    });

    // 8. canonicalUrl
    const hasCanonical = !!(seo?.canonicalUrl);
    checks.push({
      name: 'canonicalUrl',
      passed: hasCanonical,
      points: hasCanonical ? 5 : 0,
      maxPoints: 5,
      advice: hasCanonical
        ? '캐노니컬 URL이 설정되어 있습니다.'
        : '캐노니컬 URL을 설정하세요.',
    });

    // 9. singleH1
    const h1Matches = content.match(/<h1[\s>]/gi) || [];
    const hasSingleH1 = h1Matches.length === 1;
    checks.push({
      name: 'singleH1',
      passed: hasSingleH1,
      points: hasSingleH1 ? 5 : 0,
      maxPoints: 5,
      advice: hasSingleH1
        ? 'H1 태그가 하나만 존재합니다.'
        : `H1 태그가 ${h1Matches.length}개 있습니다. 정확히 1개만 사용하세요.`,
    });

    // 10. h1Keyword
    const h1ContentMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const h1Text = h1ContentMatch ? stripHtml(h1ContentMatch[1]) : '';
    const h1HasKeyword =
      !!focusKeyword && h1Text.toLowerCase().includes(focusKeyword.toLowerCase());
    checks.push({
      name: 'h1Keyword',
      passed: h1HasKeyword,
      points: h1HasKeyword ? 5 : 0,
      maxPoints: 5,
      advice: h1HasKeyword
        ? 'H1에 포커스 키워드가 포함되어 있습니다.'
        : 'H1 태그에 포커스 키워드를 포함하세요.',
    });

    // 11. headingHierarchy
    const headingLevels: number[] = [];
    const headingRegex = /<h([2-6])[\s>]/gi;
    let hMatch: RegExpExecArray | null;
    while ((hMatch = headingRegex.exec(content)) !== null) {
      headingLevels.push(parseInt(hMatch[1], 10));
    }
    let hierarchyOk = true;
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] > headingLevels[i - 1] + 1) {
        hierarchyOk = false;
        break;
      }
    }
    checks.push({
      name: 'headingHierarchy',
      passed: hierarchyOk,
      points: hierarchyOk ? 5 : 0,
      maxPoints: 5,
      advice: hierarchyOk
        ? '헤딩 계층 구조가 올바릅니다.'
        : '헤딩 레벨을 건너뛰지 마세요 (예: H2 다음에 H4 사용 금지).',
    });

    // 12. imageAlt
    const imgTags = content.match(/<img[^>]*>/gi) || [];
    const allHaveAlt =
      imgTags.length === 0 ||
      imgTags.every((img) => /alt\s*=\s*"[^"]+"/i.test(img) || /alt\s*=\s*'[^']+'/i.test(img));
    checks.push({
      name: 'imageAlt',
      passed: allHaveAlt,
      points: allHaveAlt ? 5 : 0,
      maxPoints: 5,
      advice: allHaveAlt
        ? '모든 이미지에 alt 속성이 있습니다.'
        : '모든 이미지에 설명이 포함된 alt 속성을 추가하세요.',
    });

    // 13. imageFileName
    const srcMatches = content.match(/src\s*=\s*["']([^"']+)["']/gi) || [];
    const descriptiveNames =
      srcMatches.length === 0 ||
      srcMatches.every((src) => {
        const url = src.replace(/src\s*=\s*["']/i, '').replace(/["']$/, '');
        const fileName = url.split('/').pop() || '';
        const nameOnly = fileName.replace(/\.[^.]+$/, '');
        return nameOnly.length > 3 && !/^\d+$/.test(nameOnly);
      });
    checks.push({
      name: 'imageFileName',
      passed: descriptiveNames,
      points: descriptiveNames ? 5 : 0,
      maxPoints: 5,
      advice: descriptiveNames
        ? '이미지 파일명이 설명적입니다.'
        : '이미지 파일명을 설명적으로 변경하세요 (숫자만 사용 금지).',
    });

    // 14. internalLinks
    const internalLinks = (content.match(/href\s*=\s*["']\/[^"']*["']/gi) || []).length;
    const hasInternalLinks = internalLinks >= 2;
    checks.push({
      name: 'internalLinks',
      passed: hasInternalLinks,
      points: hasInternalLinks ? 5 : 0,
      maxPoints: 5,
      advice: hasInternalLinks
        ? `내부 링크가 ${internalLinks}개 있습니다.`
        : `내부 링크가 ${internalLinks}개입니다. 최소 2개의 내부 링크를 추가하세요.`,
    });

    // 15. urlStructure
    const slug = post.slug || '';
    const cleanSlug = /^[a-z0-9\-가-힣]+$/.test(slug) && slug.length < 80;
    checks.push({
      name: 'urlStructure',
      passed: cleanSlug,
      points: cleanSlug ? 5 : 0,
      maxPoints: 5,
      advice: cleanSlug
        ? 'URL 구조가 깔끔합니다.'
        : 'URL 슬러그를 소문자, 하이픈만 사용하여 80자 미만으로 설정하세요.',
    });

    // 16. contentLength
    const contentLong = wordCount >= 300;
    checks.push({
      name: 'contentLength',
      passed: contentLong,
      points: contentLong ? 5 : 0,
      maxPoints: 5,
      advice: contentLong
        ? `콘텐츠가 ${wordCount}단어입니다.`
        : `콘텐츠가 ${wordCount}단어입니다. 최소 300단어 이상 작성하세요.`,
    });

    // 17. keywordDensity
    let densityOk = false;
    if (focusKeyword && wordCount > 0) {
      const keywordRegex = new RegExp(focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const keywordCount = (plainText.match(keywordRegex) || []).length;
      const density = (keywordCount / wordCount) * 100;
      densityOk = density >= 1 && density <= 3;
      checks.push({
        name: 'keywordDensity',
        passed: densityOk,
        points: densityOk ? 5 : 0,
        maxPoints: 5,
        advice: densityOk
          ? `키워드 밀도가 ${density.toFixed(1)}%로 적절합니다.`
          : `키워드 밀도가 ${density.toFixed(1)}%입니다. 1-3% 사이로 조정하세요.`,
      });
    } else {
      checks.push({
        name: 'keywordDensity',
        passed: false,
        points: 0,
        maxPoints: 5,
        advice: '포커스 키워드를 설정하고 콘텐츠에 적절히 포함하세요.',
      });
    }

    // 18. robotsMeta
    const robotsOk = seo?.robotsMeta === 'index, follow';
    checks.push({
      name: 'robotsMeta',
      passed: robotsOk,
      points: robotsOk ? 5 : 0,
      maxPoints: 5,
      advice: robotsOk
        ? 'robots 메타가 올바르게 설정되어 있습니다.'
        : 'robots 메타를 "index, follow"로 설정하세요.',
    });

    // 19. structuredData
    const hasStructured = !!(seo?.jsonLdType || seo?.jsonLdData);
    checks.push({
      name: 'structuredData',
      passed: hasStructured,
      points: hasStructured ? 5 : 0,
      maxPoints: 5,
      advice: hasStructured
        ? '구조화된 데이터가 설정되어 있습니다.'
        : 'JSON-LD 타입 또는 데이터를 설정하세요.',
    });

    // 20. languageTag (always pass)
    checks.push({
      name: 'languageTag',
      passed: true,
      points: 5,
      maxPoints: 5,
      advice: '언어 태그가 앱 레벨에서 설정되어 있습니다.',
    });

    return checks;
  }

  // ─── AEO Checks (16 checks, 100pts total) ───

  private calculateAeoChecks(
    post: { content: string; slug: string; title: string },
    seo: any,
  ): Check[] {
    const content = post.content || '';
    const plainText = stripHtml(content);
    const checks: Check[] = [];

    // 1. jsonLdType (7pts)
    const validTypes = ['Article', 'FAQPage', 'HowTo', 'LocalBusiness'];
    const hasValidType = validTypes.includes(seo?.jsonLdType || '');
    checks.push({
      name: 'jsonLdType',
      passed: hasValidType,
      points: hasValidType ? 7 : 0,
      maxPoints: 7,
      advice: hasValidType
        ? `JSON-LD 타입이 "${seo.jsonLdType}"으로 설정되어 있습니다.`
        : 'JSON-LD 타입을 Article, FAQPage, HowTo, LocalBusiness 중 하나로 설정하세요.',
    });

    // 2. faqSchema (7pts)
    let faqCount = 0;
    try {
      const faqItems = JSON.parse(seo?.faqItems || '[]');
      faqCount = Array.isArray(faqItems) ? faqItems.length : 0;
    } catch { /* ignore */ }
    const hasFaq = faqCount >= 3;
    checks.push({
      name: 'faqSchema',
      passed: hasFaq,
      points: hasFaq ? 7 : 0,
      maxPoints: 7,
      advice: hasFaq
        ? `FAQ 스키마에 ${faqCount}개의 항목이 있습니다.`
        : `FAQ 스키마가 없거나 ${faqCount}개 미만입니다. 최소 3개의 Q&A를 추가하세요.`,
    });

    // 3. howToSchema (6pts)
    let howToCount = 0;
    try {
      const steps = JSON.parse(seo?.howToSteps || '[]');
      howToCount = Array.isArray(steps) ? steps.length : 0;
    } catch { /* ignore */ }
    const hasHowTo = howToCount >= 3;
    checks.push({
      name: 'howToSchema',
      passed: hasHowTo,
      points: hasHowTo ? 6 : 0,
      maxPoints: 6,
      advice: hasHowTo
        ? `HowTo 스키마에 ${howToCount}개의 단계가 있습니다.`
        : `HowTo 스키마가 없거나 ${howToCount}개 미만입니다. 최소 3개의 단계를 추가하세요.`,
    });

    // 4. qaFormat (6pts)
    const qaHeadings = (content.match(/<h[2-6][^>]*>.*?\?<\/h[2-6]>/gi) || []).length;
    const hasQaFormat = qaHeadings >= 2;
    checks.push({
      name: 'qaFormat',
      passed: hasQaFormat,
      points: hasQaFormat ? 6 : 0,
      maxPoints: 6,
      advice: hasQaFormat
        ? `질문형 헤딩이 ${qaHeadings}개 있습니다.`
        : `질문형 헤딩이 ${qaHeadings}개입니다. 최소 2개의 질문형 헤딩(물음표로 끝나는)을 추가하세요.`,
    });

    // 5. conciseAnswers (6pts)
    const qHeadingRegex = /<h[2-6][^>]*>.*?\?<\/h[2-6]>\s*<p[^>]*>(.*?)<\/p>/gi;
    const answerMatches: string[] = [];
    let qMatch: RegExpExecArray | null;
    while ((qMatch = qHeadingRegex.exec(content)) !== null) {
      answerMatches.push(qMatch[1]);
    }
    const conciseOk =
      answerMatches.length > 0 &&
      answerMatches.every((a) => {
        const wc = countWords(stripHtml(a));
        return wc >= 40 && wc <= 60;
      });
    checks.push({
      name: 'conciseAnswers',
      passed: conciseOk,
      points: conciseOk ? 6 : 0,
      maxPoints: 6,
      advice: conciseOk
        ? '질문형 헤딩 뒤의 답변 길이가 적절합니다.'
        : '질문형 헤딩 뒤의 첫 번째 단락을 40-60단어로 작성하세요.',
    });

    // 6. entityKeywords (6pts)
    const foundTerms = MEDICAL_TERMS.filter((term) => plainText.includes(term));
    const hasEntityKeywords = foundTerms.length >= 5;
    checks.push({
      name: 'entityKeywords',
      passed: hasEntityKeywords,
      points: hasEntityKeywords ? 6 : 0,
      maxPoints: 6,
      advice: hasEntityKeywords
        ? `의료 관련 용어가 ${foundTerms.length}개 포함되어 있습니다.`
        : `의료 관련 용어가 ${foundTerms.length}개입니다. 최소 5개의 전문 용어를 포함하세요.`,
    });

    // 7. topicDepth (6pts)
    const h2Count = (content.match(/<h2[\s>]/gi) || []).length;
    const hasTopicDepth = h2Count >= 3;
    checks.push({
      name: 'topicDepth',
      passed: hasTopicDepth,
      points: hasTopicDepth ? 6 : 0,
      maxPoints: 6,
      advice: hasTopicDepth
        ? `H2 태그가 ${h2Count}개 있습니다.`
        : `H2 태그가 ${h2Count}개입니다. 최소 3개의 H2 태그를 사용하세요.`,
    });

    // 8. longTailQuestions (6pts)
    const questionWords = ['어떻게', '무엇', '왜', '언제', '어디', '누가', '얼마', 'how', 'what', 'why', 'when', 'where', 'who'];
    const titleAndHeadings = post.title + ' ' + (content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || []).map((h) => stripHtml(h)).join(' ');
    const hasQuestionWords = questionWords.some((w) => titleAndHeadings.includes(w));
    checks.push({
      name: 'longTailQuestions',
      passed: hasQuestionWords,
      points: hasQuestionWords ? 6 : 0,
      maxPoints: 6,
      advice: hasQuestionWords
        ? '타이틀이나 헤딩에 질문형 키워드가 포함되어 있습니다.'
        : '타이틀이나 헤딩에 질문형 키워드를 포함하세요 (어떻게, 무엇, 왜 등).',
    });

    // 9. contentFreshness (7pts)
    let freshness = false;
    if (seo?.lastReviewedAt) {
      const reviewDate = new Date(seo.lastReviewedAt);
      const daysDiff = (Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24);
      freshness = daysDiff <= 90;
    }
    checks.push({
      name: 'contentFreshness',
      passed: freshness,
      points: freshness ? 7 : 0,
      maxPoints: 7,
      advice: freshness
        ? '콘텐츠가 최근 90일 이내에 리뷰되었습니다.'
        : '콘텐츠 리뷰 날짜를 최근 90일 이내로 업데이트하세요.',
    });

    // 10. tldrSummary (6pts)
    const tldr = seo?.tldrSummary || '';
    const tldrWordCount = countWords(tldr);
    const hasTldr = !!tldr && tldrWordCount >= 40 && tldrWordCount <= 80;
    checks.push({
      name: 'tldrSummary',
      passed: hasTldr,
      points: hasTldr ? 6 : 0,
      maxPoints: 6,
      advice: hasTldr
        ? `TL;DR 요약이 ${tldrWordCount}단어로 적절합니다.`
        : `TL;DR 요약이 ${tldr ? tldrWordCount + '단어입니다' : '없습니다'}. 40-80단어로 작성하세요.`,
    });

    // 11. bulletLists (6pts)
    const listCount = (content.match(/<(ul|ol)[\s>]/gi) || []).length;
    const hasLists = listCount >= 2;
    checks.push({
      name: 'bulletLists',
      passed: hasLists,
      points: hasLists ? 6 : 0,
      maxPoints: 6,
      advice: hasLists
        ? `목록이 ${listCount}개 있습니다.`
        : `목록이 ${listCount}개입니다. 최소 2개의 목록(ul/ol)을 추가하세요.`,
    });

    // 12. tableData (6pts)
    const tableCount = (content.match(/<table[\s>]/gi) || []).length;
    const hasTables = tableCount >= 1;
    checks.push({
      name: 'tableData',
      passed: hasTables,
      points: hasTables ? 6 : 0,
      maxPoints: 6,
      advice: hasTables
        ? `테이블이 ${tableCount}개 있습니다.`
        : '비교 데이터나 정보를 테이블로 추가하세요.',
    });

    // 13. definitionBlocks (6pts)
    const hasDefinitions = /<strong>[^<]+<\/strong>\s*[:：]\s*[^<]+/.test(content) ||
      /<strong>[^<]+<\/strong>\s*[은는이가]\s*/.test(content);
    checks.push({
      name: 'definitionBlocks',
      passed: hasDefinitions,
      points: hasDefinitions ? 6 : 0,
      maxPoints: 6,
      advice: hasDefinitions
        ? '정의형 블록이 포함되어 있습니다.'
        : '<strong> 태그를 사용한 정의형 설명 블록을 추가하세요.',
    });

    // 14. sourceCitations (6pts)
    const externalLinks = (content.match(/href\s*=\s*["']https?:\/\/[^"']+["']/gi) || []).length;
    const hasCitations = externalLinks >= 1;
    checks.push({
      name: 'sourceCitations',
      passed: hasCitations,
      points: hasCitations ? 6 : 0,
      maxPoints: 6,
      advice: hasCitations
        ? `외부 출처 링크가 ${externalLinks}개 있습니다.`
        : '신뢰할 수 있는 외부 출처 링크를 추가하세요.',
    });

    // 15. featuredSnippet (6pts)
    const firstH2Match = content.match(/<h2[^>]*>.*?<\/h2>\s*<p[^>]*>(.*?)<\/p>/i);
    let snippetOk = false;
    if (firstH2Match) {
      const pWordCount = countWords(stripHtml(firstH2Match[1]));
      snippetOk = pWordCount >= 40 && pWordCount <= 60;
    }
    checks.push({
      name: 'featuredSnippet',
      passed: snippetOk,
      points: snippetOk ? 6 : 0,
      maxPoints: 6,
      advice: snippetOk
        ? '첫 번째 H2 뒤의 단락이 추천 스니펫에 적합합니다.'
        : '첫 번째 H2 뒤의 단락을 40-60단어로 작성하여 추천 스니펫에 최적화하세요.',
    });

    // 16. conversationalKeywords (7pts)
    const conversationalPatterns = ['란', '는', '할 때', '인가요', '일까요'];
    const hasConversational = conversationalPatterns.some((p) => plainText.includes(p));
    checks.push({
      name: 'conversationalKeywords',
      passed: hasConversational,
      points: hasConversational ? 7 : 0,
      maxPoints: 7,
      advice: hasConversational
        ? '자연스러운 대화형 키워드가 포함되어 있습니다.'
        : '한국어 자연어 패턴 (란, 는, 할 때, 인가요, 일까요)을 포함하세요.',
    });

    return checks;
  }

  // ─── GEO Checks (17 checks, 100pts total) ───

  private calculateGeoChecks(
    post: { content: string; slug: string; title: string },
    seo: any,
  ): Check[] {
    const content = post.content || '';
    const plainText = stripHtml(content);
    const localBiz = seo?.localBusinessData || '';
    const checks: Check[] = [];

    // 1. localBusinessJsonLd (7pts)
    const hasLocalType = localBiz.includes('@type');
    checks.push({
      name: 'localBusinessJsonLd',
      passed: hasLocalType,
      points: hasLocalType ? 7 : 0,
      maxPoints: 7,
      advice: hasLocalType
        ? 'LocalBusiness JSON-LD가 설정되어 있습니다.'
        : 'LocalBusiness JSON-LD 스키마에 @type을 설정하세요.',
    });

    // 2. napConsistency (7pts)
    const hasNap =
      localBiz.includes('name') &&
      localBiz.includes('address') &&
      localBiz.includes('telephone');
    checks.push({
      name: 'napConsistency',
      passed: hasNap,
      points: hasNap ? 7 : 0,
      maxPoints: 7,
      advice: hasNap
        ? 'NAP (이름, 주소, 전화번호) 정보가 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 name, address, telephone을 포함하세요.',
    });

    // 3. businessHours (6pts)
    const hasHours = localBiz.includes('openingHours');
    checks.push({
      name: 'businessHours',
      passed: hasHours,
      points: hasHours ? 6 : 0,
      maxPoints: 6,
      advice: hasHours
        ? '영업시간 정보가 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 openingHours를 추가하세요.',
    });

    // 4. geoCoordinates (6pts)
    const hasGeo =
      localBiz.includes('latitude') ||
      localBiz.includes('longitude') ||
      localBiz.includes('geo');
    checks.push({
      name: 'geoCoordinates',
      passed: hasGeo,
      points: hasGeo ? 6 : 0,
      maxPoints: 6,
      advice: hasGeo
        ? '지리 좌표 정보가 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 위도/경도 좌표를 추가하세요.',
    });

    // 5. serviceArea (5pts)
    const hasServiceArea = !!(seo?.serviceArea);
    checks.push({
      name: 'serviceArea',
      passed: hasServiceArea,
      points: hasServiceArea ? 5 : 0,
      maxPoints: 5,
      advice: hasServiceArea
        ? '서비스 지역이 설정되어 있습니다.'
        : '서비스 지역을 설정하세요.',
    });

    // 6. localKeywordsCount (6pts)
    const localKw = seo?.localKeywords || '';
    const kwTerms = localKw
      .split(',')
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);
    const hasLocalKw = kwTerms.length >= 3;
    checks.push({
      name: 'localKeywordsCount',
      passed: hasLocalKw,
      points: hasLocalKw ? 6 : 0,
      maxPoints: 6,
      advice: hasLocalKw
        ? `로컬 키워드가 ${kwTerms.length}개 설정되어 있습니다.`
        : `로컬 키워드가 ${kwTerms.length}개입니다. 최소 3개의 쉼표로 구분된 키워드를 추가하세요.`,
    });

    // 7. koreanAddress (6pts)
    const hasKoreanAddr =
      localBiz.includes('시') || localBiz.includes('구') || localBiz.includes('동');
    checks.push({
      name: 'koreanAddress',
      passed: hasKoreanAddr,
      points: hasKoreanAddr ? 6 : 0,
      maxPoints: 6,
      advice: hasKoreanAddr
        ? '한국식 주소가 포함되어 있습니다.'
        : '주소에 시/구/동 정보를 포함하세요.',
    });

    // 8. mapLink (5pts)
    const hasMapLink = localBiz.includes('hasMap') || content.includes('map') || content.includes('지도');
    checks.push({
      name: 'mapLink',
      passed: hasMapLink,
      points: hasMapLink ? 5 : 0,
      maxPoints: 5,
      advice: hasMapLink
        ? '지도 링크가 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 hasMap 또는 콘텐츠에 지도 링크를 추가하세요.',
    });

    // 9. medicalSchema (6pts)
    const hasMedicalType =
      localBiz.includes('MedicalBusiness') || localBiz.includes('Physician');
    checks.push({
      name: 'medicalSchema',
      passed: hasMedicalType,
      points: hasMedicalType ? 6 : 0,
      maxPoints: 6,
      advice: hasMedicalType
        ? '의료 비즈니스 스키마가 설정되어 있습니다.'
        : 'LocalBusiness @type을 MedicalBusiness 또는 Physician으로 설정하세요.',
    });

    // 10. departmentListings (6pts)
    const hasDepartments =
      localBiz.includes('department') || localBiz.includes('services');
    checks.push({
      name: 'departmentListings',
      passed: hasDepartments,
      points: hasDepartments ? 6 : 0,
      maxPoints: 6,
      advice: hasDepartments
        ? '진료 과목 또는 서비스 목록이 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 department 또는 services 배열을 추가하세요.',
    });

    // 11. appointmentLink (6pts)
    const hasAppointment =
      localBiz.includes('url') || localBiz.includes('potentialAction') || localBiz.includes('booking');
    checks.push({
      name: 'appointmentLink',
      passed: hasAppointment,
      points: hasAppointment ? 6 : 0,
      maxPoints: 6,
      advice: hasAppointment
        ? '예약 링크가 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 예약 URL 또는 potentialAction을 추가하세요.',
    });

    // 12. emergencyContact (5pts)
    const hasEmergency = localBiz.includes('emergency') || localBiz.includes('응급');
    checks.push({
      name: 'emergencyContact',
      passed: hasEmergency,
      points: hasEmergency ? 5 : 0,
      maxPoints: 5,
      advice: hasEmergency
        ? '응급 연락처 정보가 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 응급 연락처 정보를 추가하세요.',
    });

    // 13. parkingTransport (5pts)
    const combined = plainText + ' ' + localBiz;
    const hasParkingTransport =
      combined.includes('주차') ||
      combined.includes('교통') ||
      combined.includes('지하철') ||
      combined.includes('버스');
    checks.push({
      name: 'parkingTransport',
      passed: hasParkingTransport,
      points: hasParkingTransport ? 5 : 0,
      maxPoints: 5,
      advice: hasParkingTransport
        ? '주차/교통 정보가 포함되어 있습니다.'
        : '주차, 교통, 지하철, 버스 등 접근성 정보를 포함하세요.',
    });

    // 14. nearbyLandmarks (6pts)
    const hasLandmarks =
      combined.includes('역') ||
      combined.includes('사거리') ||
      combined.includes('건물');
    checks.push({
      name: 'nearbyLandmarks',
      passed: hasLandmarks,
      points: hasLandmarks ? 6 : 0,
      maxPoints: 6,
      advice: hasLandmarks
        ? '주변 랜드마크 정보가 포함되어 있습니다.'
        : '근처 역, 사거리, 건물 등 랜드마크를 언급하세요.',
    });

    // 15. regionalRelevance (6pts)
    const districtKeywords = ['강남', '서초', '신사', '역삼', '삼성', '잠실', '송파', '마포', '홍대', '이태원', '종로', '명동'];
    const hasRegional = districtKeywords.some((d) => combined.includes(d));
    checks.push({
      name: 'regionalRelevance',
      passed: hasRegional,
      points: hasRegional ? 6 : 0,
      maxPoints: 6,
      advice: hasRegional
        ? '지역 키워드가 포함되어 있습니다.'
        : '강남, 서초, 신사 등 지역 키워드를 콘텐츠에 포함하세요.',
    });

    // 16. reviewSchema (6pts)
    const hasReview =
      localBiz.includes('aggregateRating') || localBiz.includes('review');
    checks.push({
      name: 'reviewSchema',
      passed: hasReview,
      points: hasReview ? 6 : 0,
      maxPoints: 6,
      advice: hasReview
        ? '리뷰 스키마가 포함되어 있습니다.'
        : 'LocalBusiness 데이터에 aggregateRating 또는 review를 추가하세요.',
    });

    // 17. multiLocation (6pts)
    const hasMultiLoc =
      localBiz.includes('branchOf') ||
      localBiz.includes('locations') ||
      localBiz.includes('branch');
    checks.push({
      name: 'multiLocation',
      passed: hasMultiLoc,
      points: hasMultiLoc ? 6 : 0,
      maxPoints: 6,
      advice: hasMultiLoc
        ? '다중 지점 정보가 포함되어 있습니다.'
        : '여러 지점이 있는 경우 branchOf 또는 다중 location 정보를 추가하세요.',
    });

    return checks;
  }
}
