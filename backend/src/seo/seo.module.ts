import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { SeoScoreService } from './seo-score.service';

@Module({
  controllers: [SeoController],
  providers: [SeoService, SeoScoreService],
  exports: [SeoService, SeoScoreService],
})
export class SeoModule {}
