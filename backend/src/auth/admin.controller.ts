import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
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
      if (body.newPassword.length < 6) {
        throw new BadRequestException('새 비밀번호는 6자 이상이어야 합니다');
      }

      const admin = await this.prisma.admin.findUnique({ where: { id: req.user.id } });
      if (!admin) throw new NotFoundException('관리자를 찾을 수 없습니다');

      const valid = await bcrypt.compare(body.currentPassword, admin.passwordHash);
      if (!valid) throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다');

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
