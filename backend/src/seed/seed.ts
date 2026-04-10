import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ─── Read post data from boardDummy.js ───
interface SeedPost {
  name: string;
  url: string;
  date: string;
  categorySlug: string;
  tags: string[];
  thumbnail: string;
  recommended: boolean;
  noticePost: boolean;
  editorPick: boolean;
  content: string;
}

function loadBoardDummy(): SeedPost[] {
  const dummyPath = path.resolve(__dirname, '../../../src/lib/constants/boardDummy.js');
  const fileContent = fs.readFileSync(dummyPath, 'utf-8');
  // Extract just the array portion after "export const boardDummy = "
  const startIdx = fileContent.indexOf('[');
  if (startIdx === -1) throw new Error('Could not find array in boardDummy.js');
  const arrayStr = fileContent.slice(startIdx);
  // Use Function constructor to safely parse the JS array literal
  const fn = new Function(`return ${arrayStr}`);
  return fn();
}

const seedPosts: SeedPost[] = loadBoardDummy();

// Removed inline data - now loaded from boardDummy.js
const _unused = [
  {
    name: '투데이라섹 눈부심 수술 후 밝은 빛이 불편할 때',
    url: '/eye-story/eye-health-report/테스트-게시글-1',
    date: 'Tue, 20 Jan 2026 02:15:22 +0000',
    categorySlug: 'eye-health-report',
    tags: ['투데이라섹', '투데이라섹눈부심'],
    thumbnail: '/dummy_img/2026/01/sExamination_img6.jpg',
    recommended: true,
    noticePost: true,
    editorPick: true,
    content: `<p></p><p></p><p><strong>투데이라섹 눈부심 수술 후 밝은 빛이 불편할 때</strong></p><figure><img src="/dummy_img/2026/01/image-7-494x1024.png" alt="" /></figure><figure><img src="/dummy_img/2026/01/image-9-346x1024.png" alt="" /></figure><figure><img src="/dummy_img/2026/01/image-10-436x1024.png" alt="" /></figure><figure><img src="/dummy_img/2026/01/image-11-309x1024.png" alt="" /></figure><figure><img src="/dummy_img/2026/01/image-12-354x1024.png" alt="" /></figure><figure><img src="/dummy_img/2026/01/image-13-249x1024.png" alt="" /></figure><figure><img src="/dummy_img/2026/01/image-14.png" alt="" /></figure><p><strong>수술 직후 밝은 빛이 더 강하게 느껴지는 이유</strong></p><p>투데이라섹은 각막 표면을 정교하게 다듬어 시력을 교정하는 방식이기 때문에, 수술 직후에는 눈 표면이 회복되는 동안 빛에 민감하게 반응할 수 있습니다.</p>`,
  },
  {
    name: '9살 드림렌즈 성장기 어린이에게 적용되는 안전 포인트 꼭 확인하세요!',
    url: '/eye-story/restore-clarity/dream-lens',
    date: 'Tue, 20 Jan 2026 02:27:41 +0000',
    categorySlug: 'restore-clarity',
    tags: [],
    thumbnail: '/dummy_img/2026/01/9살-드림렌즈.png',
    recommended: false,
    noticePost: false,
    editorPick: false,
    content: `<figure style="border-style:none;border-width:0px"><blockquote><p><strong>9살 드림렌즈 성장기 어린이에게 적용되는 안전한 시력 교정</strong></p></blockquote></figure><figure><img src="/dummy_img/2026/01/image-599x1024.png" alt="소아근시" /></figure><p><strong>1. 성장기 시력 변화와 드림렌즈의 필요성</strong></p><p>어린이의 눈은 성장하면서 지속적으로 형태가 변하기 때문에 근시가 빠르게 진행될 수 있습니다.</p>`,
  },
  {
    name: '안구건조증 치료방법 눈 피로가 반복될 때 살펴보는 원인',
    url: '/eye-story/eye-health-report/dry-eye-syndrome',
    date: 'Thu, 12 Feb 2026 08:51:49 +0000',
    categorySlug: 'eye-health-report',
    tags: ['안구건조증', '안구건조증치료방법'],
    thumbnail: '/dummy_img/2026/02/안구건조증_치료이미지-edited.png',
    recommended: false,
    noticePost: false,
    editorPick: false,
    content: `<h2>안구건조증 치료방법 눈이 뻑뻑하게 느껴진다면 확인해보세요!</h2><figure><img src="/dummy_img/2026/02/연세척병원-블로그-썸네일.png" alt="" /></figure><h3>눈 표면의 균형이 무너질 때 나타나는 변화</h3><p>눈은 표면을 감싸는 눈물이 일정한 균형을 유지할 때 편안함을 느낍니다.</p>`,
  },
  {
    name: '당뇨망막병증 초기 발견, 초기 징후와 발견의 중요성',
    url: '/eye-story/silent-vision-thief/diabetic-retinopathy',
    date: 'Mon, 23 Feb 2026 02:54:23 +0000',
    categorySlug: 'silent-vision-thief',
    tags: ['당뇨망막병증', '당뇨망막병증증상', '당뇨망막병증치료'],
    thumbnail: '/dummy_img/2026/02/더원서울안과_웹블로그_썸네일1-scaled.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>당뇨망막병증 초기발견, 정기적인 안저 검사가 시력을 보호합니다</h2><figure><img src="/dummy_img/2026/02/더원서울안과_당뇨망막병증_1-1-285x1024.png" alt="" /></figure><h3>당뇨망막병증의 발생 과정</h3><p>당뇨망막병증은 단순히 눈의 병이 아니라, <strong>전신 혈관 질환인 당뇨가 눈의 미세혈관을 공격</strong>하면서 시작됩니다.</p>`,
  },
  {
    name: '녹내장에 좋은 생활 습관과 관리 방법',
    url: '/eye-story/restore-clarity/glaucoma',
    date: 'Mon, 23 Feb 2026 03:45:14 +0000',
    categorySlug: 'restore-clarity',
    tags: ['녹내장', '녹내장관리법', '녹내장생활습관', '녹내장증상', '녹내장치료'],
    thumbnail: '/dummy_img/2026/02/더원서울안과_웹블로그_썸네일2.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>소리 없는 시력 도둑, 녹내장 예방을 위한 '녹내장에 좋은 생활습관' 총정리</h2><figure><img src="/dummy_img/2026/02/image-7.png" alt="" /></figure><h3>녹내장과 시신경 손상의 연관성</h3><p>녹내장은 시신경이 손상되면서 점차 시야가 좁아지는 진행성 안질환으로, 조기에 발견하지 못하면 실명으로 이어질 수 있어 각별한 주의가 필요합니다.</p>`,
  },
  {
    name: '투데이라섹 빛번짐이 생기는 의학적 원인과 회복의 과정',
    url: '/eye-story/deep-eye-stories/투데이라섹-빛번짐이-생기는-의학적-원인과-회복의',
    date: 'Tue, 24 Feb 2026 01:48:15 +0000',
    categorySlug: 'deep-eye-stories',
    tags: ['빛번짐', '투데이라섹', '투데이라섹 빛번짐'],
    thumbnail: '/dummy_img/2026/02/투데이라섹-빛번짐-scaled.png',
    recommended: false,
    noticePost: false,
    editorPick: false,
    content: `<p></p><blockquote><p>투데이라섹 빛번짐이 생기는 의학적 원인과 회복의 과정</p></blockquote><p></p><figure><img src="/dummy_img/2026/02/그림1.png" alt="" /></figure><p><strong>투데이라섹 빛번짐</strong> 생기는 원인과 회복 과정을 우선 이해!</p><p><strong>각막이 변화하는 원리</strong><br>투데이라섹은 각막 상피를 제거한 뒤 레이저로 실질부를 절삭해 굴절 이상을 교정하는 방식으로 진행된다.</p>`,
  },
  {
    name: '안구건조증 인공눈물 사용과 눈 건강 관리의 핵심',
    url: '/eye-story/eye-health-report/dry_eye_syndrome_eye_drops',
    date: 'Wed, 25 Feb 2026 03:44:26 +0000',
    categorySlug: 'eye-health-report',
    tags: ['눈건강', '눈뻑뻑함', '눈이물감', '안구건조증', '안구건조증 인공눈물', '인공눈물'],
    thumbnail: '/dummy_img/2026/02/썸네일.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>안구건조증 인공눈물 어떻게 사용해야 좋을까요?<br><br></h2><figure><img src="/dummy_img/2026/02/더원서울안과_안구건조증_11-2-601x1024.png" alt="" /></figure><h3><br><br>안구건조증의 정의와 원인</h3><p>안구건조증은 <strong>눈을 보호하는 눈물층이 불안정하거나 부족해 발생하는 대표적인 안질환</strong>입니다.</p>`,
  },
  {
    name: '당뇨망막병증 초기 발견이 중요한 이유와 관리 방법',
    url: '/eye-story/silent-vision-thief/diabetic_retinopathy',
    date: 'Thu, 26 Feb 2026 06:59:54 +0000',
    categorySlug: 'silent-vision-thief',
    tags: ['당뇨망막병증', '당뇨망막병증수술', '당뇨망막병증초기발견', '당뇨망막병증치료'],
    thumbnail: '/dummy_img/2026/02/더원서울안과_웹블로그-썸네일_당뇨망막병증.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>당뇨망막병증 초기 발견과 관리법, '골든타임'을 놓치지 마세요!</h2><figure><img src="/dummy_img/2026/02/더원서울안과_당뇨망막병증_1-2-285x1024.png" alt="" /></figure><h3>당뇨망막병증의 발생 과정</h3><p>당뇨망막병증은 당뇨병의 대표적인 합병증으로, 혈당 조절이 원활하지 않아 망막의 미세혈관이 손상되면서 시작됩니다.</p>`,
  },
  {
    name: '녹내장 약물치료 시신경 변화가 조용히 진행될 때 필요한 관리 흐름',
    url: '/eye-story/deep-eye-stories/glaucoma-drug-treatment',
    date: 'Wed, 04 Mar 2026 04:00:48 +0000',
    categorySlug: 'deep-eye-stories',
    tags: ['녹내장', '녹내장약물치료', '눈건강', '시야변화'],
    thumbnail: '/dummy_img/2026/03/더원서울안과_웹블로그_썸네일3.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>녹내장 약물치료 시신경 변화가 조용히 진행될 때 필요한 관리 흐름</h2><figure><img src="/dummy_img/2026/03/더원서울안과_녹내장_1-477x1024.png" alt="" /></figure><h3>1. 치료가 필요한 이유</h3><p>녹내장은 시신경이 서서히 손상되며 시야가 점차 좁아지는 질환으로, 초기에는 거의 불편함을 느끼지 못하는 경우가 많습니다.</p>`,
  },
  {
    name: '안구건조증 안경 착용이 도움이 되는 이유와 관리 방법',
    url: '/eye-story/eye-health-report/dry_eye_syndrome',
    date: 'Thu, 05 Mar 2026 01:49:39 +0000',
    categorySlug: 'eye-health-report',
    tags: ['눈건강', '눈관리', '안경착용', '안구건조증', '안구건조증안경착용'],
    thumbnail: '/dummy_img/2026/03/더원서울안과_웹블로그_썸네일5.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>안구건조증 안경 착용이 도움이 되는 이유와 관리 방법</h2><figure><img src="/dummy_img/2026/03/더원서울안과_안구건조증_1-183x1024.png" alt="" /></figure><h3>눈물층의 불균형으로 인한 불편감</h3><p>안구건조증은 눈을 보호하고 윤활시키는 눈물층의 균형이 무너져 눈 표면이 마르는 질환입니다.</p>`,
  },
  {
    name: '안구건조증 눈부심 증상이 일상생활에 미치는 영향과 관리 방법',
    url: '/eye-story/eye-health-report/dry-eye-syndrome-glare',
    date: 'Mon, 09 Mar 2026 06:18:19 +0000',
    categorySlug: 'eye-health-report',
    tags: ['눈건강', '눈관리', '눈부심', '안구건조증', '안구건조증눈부심', '인공눈물'],
    thumbnail: '/dummy_img/2026/03/더원서울안과_썸네일6.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>안구건조증 눈부심, 방치하면 시력 저하까지? 정확한 진단과 치료법</h2><figure><img src="/dummy_img/2026/03/더원서울안과_안구건조증_1-3-287x1024.png" alt="" /></figure><h3>1. 안구건조증과 눈부심의 연관성 이해하기</h3><p>안구건조증은 단순히 눈이 뻑뻑하거나 건조한 불편함에 그치지 않는다.</p>`,
  },
  {
    name: '투데이라섹 음주가 회복 과정에 미치는 영향과 주의 사항',
    url: '/eye-story/eye-health-report/things-to-avoid-after-today-lasek-drinking',
    date: 'Tue, 10 Mar 2026 03:36:40 +0000',
    categorySlug: 'eye-health-report',
    tags: ['라섹', '라섹후술', '라섹후음주언제부터', '투데이라섹음주', '투데이라섹후술마셔도되나요', '투데이라섹후음주'],
    thumbnail: '/dummy_img/2026/03/더원서울안과_블로그_이미지_3-scaled.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>투데이라섹 음주, 딱 한 잔은 괜찮을까? 술이 시력에 미치는 치명적 영향</h2><h3>투데이라섹의 수술 원리와 구조적 특징</h3><p>투데이라섹은 기존 라섹의 통증과 회복 부담을 최소화한 최신 시력교정술로, 각막 상피를 정밀하게 제거하고 그 아래 각막 실질층을 레이저로 교정하는 방식입니다.</p>`,
  },
  {
    name: '안구건조증 온찜질 관리와 생활 속 치료',
    url: '/eye-story/eye-health-report/dry-eye-syndrome-warm-compress',
    date: 'Wed, 11 Mar 2026 06:15:39 +0000',
    categorySlug: 'eye-health-report',
    tags: ['눈건강', '눈관리', '눈온찜질방법', '안구건조증', '안구건조증에온찜질도움', '안구건조증온찜질'],
    thumbnail: '/dummy_img/2026/03/Gemini_Generated_Image_3ig8t73ig8t73ig8.png',
    recommended: true,
    noticePost: false,
    editorPick: false,
    content: `<h2>안구건조증 온찜질, 마이봄샘 관리로 뻑뻑한 눈 탈출하는 법</h2><h3>안구건조증의 정의와 특징</h3><p>안구건조증은 <strong>눈물의 생성이나 분비, 또는 눈물의 질적 균형이 깨져 눈 표면이 건조해지고 불편감이 생기는 질환</strong>입니다.</p>`,
  },
  {
    name: '투데이라섹 출근 가능 시기와 일상 회복 방법',
    url: '/eye-story/eye-health-report/today-lasek-recovery-work',
    date: 'Fri, 13 Mar 2026 06:52:08 +0000',
    categorySlug: 'eye-health-report',
    tags: ['눈건강', '눈관리', '투데이라섹출근', '투데이라섹출근가능', '투데이라섹후출근', '투데이라섹후출근가능한가요'],
    thumbnail: '/dummy_img/2026/03/더웝서울안과-웹블로그_이미지_안약-3-scaled.png',
    recommended: false,
    noticePost: false,
    editorPick: false,
    content: `<h2>투데이라섹 출근 가능, 이것만은 꼭! 직장인 회복 관리법</h2><h3>1. 투데이라섹의 원리와 수술 특징</h3><p>투데이라섹은 <strong>라식과 라섹의 장점</strong>을 결합한 시력 교정술로, 각막 절편을 만들지 않고 각막 상피를 벗겨낸 뒤<strong> 레이저로 시력을 교정</strong>하는 방식이다.</p>`,
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ\-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Seeding database...');

  // ─── 1. Create admin ───
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@theoneblog.com' },
    update: {},
    create: {
      email: 'admin@theoneblog.com',
      passwordHash,
      name: '관리자',
      role: 'superadmin',
    },
  });
  console.log(`Admin created: ${admin.email} (id=${admin.id})`);

  // ─── 2. Create parent categories ───
  const parentCategories = [
    { name: '눈 이야기', slug: 'eye-story', sortOrder: 1 },
    { name: '의료진 스토리', slug: 'medical-team-stories', sortOrder: 2 },
    { name: '멤버 스토리', slug: 'member-stories', sortOrder: 3 },
    { name: '고객 스토리', slug: 'patient-stories', sortOrder: 4 },
    { name: '센터 소식', slug: 'center-news', sortOrder: 5 },
  ];

  const createdParents: Record<string, number> = {};

  for (const cat of parentCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        parentId: null,
      },
    });
    createdParents[cat.slug] = created.id;
    console.log(`  Parent category: ${created.name} (id=${created.id})`);
  }

  // ─── 3. Create child categories under '눈 이야기' ───
  const eyeStoryChildren = [
    { name: '눈 속 가장 깊은 이야기', slug: 'deep-eye-stories', sortOrder: 1 },
    { name: '조용히 시야를 훔치는 병', slug: 'silent-vision-thief', sortOrder: 2 },
    { name: '흐려진 세상을 다시 선명하게', slug: 'restore-clarity', sortOrder: 3 },
    { name: '안경 벗는 순간의 기술', slug: 'glasses-free-tech', sortOrder: 4 },
    { name: '멀어지는 세상, 가까이 보기', slug: 'distant-world-close-view', sortOrder: 5 },
    { name: '눈 건강 리포트', slug: 'eye-health-report', sortOrder: 6 },
  ];

  const eyeStoryParentId = createdParents['eye-story'];

  for (const child of eyeStoryChildren) {
    const created = await prisma.category.upsert({
      where: { slug: child.slug },
      update: {
        name: child.name,
        sortOrder: child.sortOrder,
        parentId: eyeStoryParentId,
      },
      create: {
        name: child.name,
        slug: child.slug,
        sortOrder: child.sortOrder,
        parentId: eyeStoryParentId,
      },
    });
    console.log(`    Child category: ${created.name} (id=${created.id}, parentId=${eyeStoryParentId})`);
  }

  // ─── 4. Create posts from boardDummy data ───
  console.log('\nSeeding posts...');

  for (const post of seedPosts) {
    // Look up category by slug
    const category = await prisma.category.findUnique({
      where: { slug: post.categorySlug },
    });

    if (!category) {
      console.warn(`  [SKIP] Category not found for slug: ${post.categorySlug}`);
      continue;
    }

    // Extract slug from url (last segment)
    const urlParts = post.url.split('/');
    const postSlug = decodeURIComponent(urlParts[urlParts.length - 1]);

    // Upsert the post (unique constraint: categoryId + slug)
    const createdPost = await prisma.post.upsert({
      where: {
        categoryId_slug: {
          categoryId: category.id,
          slug: postSlug,
        },
      },
      update: {
        title: post.name,
        content: post.content,
        thumbnail: post.thumbnail,
        recommended: post.recommended,
        noticePost: post.noticePost,
        editorPick: post.editorPick,
        publishedAt: new Date(post.date),
      },
      create: {
        title: post.name,
        slug: postSlug,
        content: post.content,
        thumbnail: post.thumbnail,
        categoryId: category.id,
        recommended: post.recommended,
        noticePost: post.noticePost,
        editorPick: post.editorPick,
        publishedAt: new Date(post.date),
      },
    });

    console.log(`  Post: "${createdPost.title}" (id=${createdPost.id}, category=${post.categorySlug})`);

    // Create/connect tags via PostTag
    if (post.tags.length > 0) {
      for (const tagName of post.tags) {
        const tagSlug = slugify(tagName);

        // Upsert the tag
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name: tagName },
          create: { name: tagName, slug: tagSlug },
        });

        // Create PostTag relation (skip if already exists)
        await prisma.postTag.upsert({
          where: {
            postId_tagId: {
              postId: createdPost.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: createdPost.id,
            tagId: tag.id,
          },
        });
      }
      console.log(`    Tags: [${post.tags.join(', ')}]`);
    }
  }

  // ─── 5. Summary ───
  const categoryCount = await prisma.category.count();
  const adminCount = await prisma.admin.count();
  const postCount = await prisma.post.count();
  const tagCount = await prisma.tag.count();
  console.log(
    `\nSeeding complete! ${adminCount} admin(s), ${categoryCount} category(ies), ${postCount} post(s), ${tagCount} tag(s) in database.`,
  );
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
