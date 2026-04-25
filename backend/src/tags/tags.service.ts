import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async search(q: string) {
    return this.prisma.tag.findMany({
      where: {
        name: { contains: q },
      },
      take: 10,
    });
  }

  async create(dto: CreateTagDto) {
    const slug = dto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-\uac00-\ud7a3]/g, '');

    return this.prisma.tag.create({
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
