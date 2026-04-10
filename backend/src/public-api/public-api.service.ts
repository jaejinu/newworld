import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicApiService {
  constructor(private prisma: PrismaService) {}

  async getPosts(query: { page?: number; perPage?: number; category?: string; search?: string; itemType?: string }) {
    const page = query.page || 1;
    const perPage = query.perPage || 10;
    const where: any = { isActive: true };

    if (query.category) {
      const cat = await this.prisma.category.findUnique({ where: { slug: query.category } });
      if (cat) where.categoryId = cat.id;
    }

    if (query.search) {
      where.title = { contains: query.search };
    }

    if (query.itemType && ['recommended', 'noticePost', 'editorPick'].includes(query.itemType)) {
      where[query.itemType] = true;
    }

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true, parentId: true, parent: { select: { slug: true, name: true } } } },
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: data.map(post => ({
        ...post,
        tags: post.tags.map(pt => pt.tag),
      })),
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    };
  }

  async getPost(categorySlug: string, postSlug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new NotFoundException('Category not found');

    const post = await this.prisma.post.findFirst({
      where: { categoryId: category.id, slug: postSlug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true, parentId: true, parent: { select: { slug: true, name: true } } } },
        tags: { include: { tag: true } },
        seoMeta: true,
      },
    });
    if (!post) throw new NotFoundException('Post not found');

    // Increment view count
    await this.prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

    return { ...post, tags: post.tags.map(pt => pt.tag) };
  }

  async getAdjacentPosts(categorySlug: string, postSlug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new NotFoundException('Category not found');

    const currentPost = await this.prisma.post.findFirst({
      where: { categoryId: category.id, slug: postSlug, isActive: true },
    });
    if (!currentPost) throw new NotFoundException('Post not found');

    const [prev, next] = await Promise.all([
      this.prisma.post.findFirst({
        where: { categoryId: category.id, isActive: true, publishedAt: { lt: currentPost.publishedAt } },
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, slug: true, thumbnail: true, publishedAt: true },
      }),
      this.prisma.post.findFirst({
        where: { categoryId: category.id, isActive: true, publishedAt: { gt: currentPost.publishedAt } },
        orderBy: { publishedAt: 'asc' },
        select: { id: true, title: true, slug: true, thumbnail: true, publishedAt: true },
      }),
    ]);

    return { prev, next };
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return categories;
  }

  async getComments(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId, isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createComment(data: { postId: number; parentId?: number; author: string; email: string; phone?: string; content: string }) {
    return this.prisma.comment.create({ data });
  }

  async getSeoMeta(postId: number) {
    return this.prisma.seoMeta.findUnique({ where: { postId } });
  }

  async getPageSeoMeta(identifier: string) {
    return this.prisma.seoMeta.findUnique({ where: { pageIdentifier: identifier } });
  }
}
