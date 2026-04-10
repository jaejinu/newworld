import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId, parentId: null, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAll(page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        skip,
        take: perPage,
        include: {
          post: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comment.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        perPage,
        lastPage: Math.ceil(total / perPage),
      },
    };
  }

  async create(dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: dto,
    });
  }

  async toggleActive(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return this.prisma.comment.update({
      where: { id },
      data: { isActive: !comment.isActive },
    });
  }
}
