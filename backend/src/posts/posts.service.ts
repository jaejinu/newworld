import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\uac00-\ud7a3]/g, '');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryPostsDto) {
    const { page = 1, perPage = 10, categorySlug, search, itemType, isActive } = query;
    const skip = (page - 1) * perPage;

    const where: any = {};

    if (categorySlug) {
      const category = await this.prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    if (search) {
      where.title = { contains: search };
    }

    if (itemType) {
      where[itemType] = true;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: perPage,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async create(dto: CreatePostDto) {
    const { tags, ...postData } = dto;

    if (!postData.excerpt && postData.content) {
      postData.excerpt = stripHtml(postData.content).slice(0, 150);
    }

    const post = await this.prisma.post.create({
      data: {
        ...postData,
        tags: tags?.length
          ? {
              create: await Promise.all(
                tags.map(async (tagName) => {
                  const slug = slugify(tagName);
                  const tag = await this.prisma.tag.upsert({
                    where: { slug },
                    update: {},
                    create: { name: tagName, slug },
                  });
                  return { tagId: tag.id };
                }),
              ),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    return post;
  }

  async update(id: number, dto: UpdatePostDto) {
    const existing = await this.prisma.post.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    const { tags, ...postData } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (tags !== undefined) {
        await tx.postTag.deleteMany({ where: { postId: id } });

        if (tags.length > 0) {
          const tagRecords = await Promise.all(
            tags.map(async (tagName) => {
              const slug = slugify(tagName);
              return tx.tag.upsert({
                where: { slug },
                update: {},
                create: { name: tagName, slug },
              });
            }),
          );

          await tx.postTag.createMany({
            data: tagRecords.map((tag) => ({ postId: id, tagId: tag.id })),
          });
        }
      }

      return tx.post.update({
        where: { id },
        data: postData,
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      });
    });
  }

  async toggleActive(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return this.prisma.post.update({
      where: { id },
      data: { isActive: !post.isActive },
    });
  }

  async updateFlags(id: number, flags: { recommended?: boolean; noticePost?: boolean; editorPick?: boolean }) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return this.prisma.post.update({
      where: { id },
      data: flags,
    });
  }
}
