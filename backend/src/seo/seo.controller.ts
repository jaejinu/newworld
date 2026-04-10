import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SeoService } from './seo.service';
import { UpsertSeoDto } from './dto/upsert-seo.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('api/admin/seo')
@UseGuards(JwtAuthGuard)
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('post/:postId')
  findByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.seoService.findByPost(postId);
  }

  @Get('page/:identifier')
  findByPage(@Param('identifier') identifier: string) {
    return this.seoService.findByPage(identifier);
  }

  @Put('post/:postId')
  upsertForPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: UpsertSeoDto,
  ) {
    return this.seoService.upsertForPost(postId, dto);
  }

  @Put('page/:identifier')
  upsertForPage(
    @Param('identifier') identifier: string,
    @Body() dto: UpsertSeoDto,
  ) {
    return this.seoService.upsertForPage(identifier, dto);
  }

  @Get('post/:postId/score')
  getScoreForPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.seoService.getScoreForPost(postId);
  }

  @Get('dashboard')
  getDashboard() {
    return this.seoService.getDashboard();
  }
}
