import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return admin;
  }

  @Patch('me')
  async updateMe(@Req() req: any, @Body() body: { name?: string; currentPassword?: string; newPassword?: string }) {
    const data: any = {};

    if (body.name) {
      data.name = body.name;
    }

    if (body.currentPassword && body.newPassword) {
      const admin = await this.prisma.admin.findUnique({ where: { id: req.user.id } });
      if (!admin) throw new Error('Admin not found');

      const valid = await bcrypt.compare(body.currentPassword, admin.passwordHash);
      if (!valid) throw new Error('Current password is incorrect');

      data.passwordHash = await bcrypt.hash(body.newPassword, 10);
    }

    const updated = await this.prisma.admin.update({
      where: { id: req.user.id },
      data,
      select: { id: true, email: true, name: true, role: true },
    });

    return updated;
  }
}
