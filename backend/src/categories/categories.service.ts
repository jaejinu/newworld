import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllFlat() {
    return this.prisma.category.findMany({
      include: { parent: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async toggleActive(id: number) {
    const category = await this.findOne(id);
    const newIsActive = !category.isActive;

    if (!newIsActive && category.children.length > 0) {
      await this.prisma.category.updateMany({
        where: { parentId: id },
        data: { isActive: false },
      });
    }

    return this.prisma.category.update({
      where: { id },
      data: { isActive: newIsActive },
    });
  }

  async reorder(id: number, sortOrder: number) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: { sortOrder },
    });
  }
}
