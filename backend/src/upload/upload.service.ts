import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async saveImage(file: Express.Multer.File) {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');

    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;

    const dirPath = path.join('uploads', yyyy, mm);
    const filePath = path.join(dirPath, fileName);

    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    const urlPath = `/uploads/${yyyy}/${mm}/${fileName}`;

    const image = await this.prisma.image.create({
      data: {
        originalName: file.originalname,
        fileName,
        path: urlPath,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    return image;
  }

  async findAll(page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      this.prisma.image.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.image.count(),
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

  async remove(id: number) {
    const image = await this.prisma.image.findUnique({ where: { id } });

    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    // image.path starts with /uploads/..., strip leading slash for fs path
    const filePath = image.path.replace(/^\//, '');

    try {
      await fs.unlink(filePath);
    } catch {
      // ignore errors if file not found on disk
    }

    await this.prisma.image.delete({ where: { id } });

    return { deleted: true };
  }
}
