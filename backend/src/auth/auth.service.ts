import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = admin;
    return result;
  }

  async login(admin: { id: number; email: string; role: string }) {
    const payload = { sub: admin.id, email: admin.email, role: admin.role };

    const accessToken = this.jwtService.sign(payload as any, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m') as any,
    });

    const refreshToken = uuidv4();
    const refreshExpiration = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION',
      '7d',
    );
    const expiresAt = this.calculateExpiry(refreshExpiration);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        adminId: admin.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    return this.prisma.$transaction(async (tx) => {
      const storedToken = await tx.refreshToken.findUnique({
        where: { token },
        include: { admin: true },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 즉시 삭제하여 동일 토큰 재사용 방지
      await tx.refreshToken.delete({
        where: { id: storedToken.id },
      });

      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      if (!storedToken.admin.isActive) {
        throw new UnauthorizedException('Admin account is inactive');
      }

      return storedToken;
    }).then((storedToken) =>
      this.login({
        id: storedToken.admin.id,
        email: storedToken.admin.email,
        role: storedToken.admin.role,
      }),
    );
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async cleanExpiredTokens() {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }

  private calculateExpiry(duration: string): Date {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Default to 7 days
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}
