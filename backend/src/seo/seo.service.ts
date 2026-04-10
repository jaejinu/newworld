import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeoScoreService } from './seo-score.service';
import { UpsertSeoDto } from './dto/upsert-seo.dto';

@Injectable()
export class SeoService {
  constructor(
    private prisma: PrismaService,
    private seoScoreService: SeoScoreService,
  ) {}

  async findByPost(postId: number) {
    const seoMeta = await this.prisma.seoMeta.findUnique({
      where: { postId },
    });
    if (!seoMeta) {
      throw new NotFoundException(`SeoMeta for post #${postId} not found`);
    }
    return seoMeta;
  }

  async findByPage(identifier: string) {
    const seoMeta = await this.prisma.seoMeta.findUnique({
      where: { pageIdentifier: identifier },
    });
    if (!seoMeta) {
      throw new NotFoundException(`SeoMeta for page "${identifier}" not found`);
    }
    return seoMeta;
  }

  async upsertForPost(postId: number, dto: UpsertSeoDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post #${postId} not found`);
    }

    const data: any = { ...dto };

    // Convert lastReviewedAt string to Date if provided
    if (dto.lastReviewedAt) {
      data.lastReviewedAt = new Date(dto.lastReviewedAt);
    }

    const seoMeta = await this.prisma.seoMeta.upsert({
      where: { postId },
      update: data,
      create: {
        ...data,
        postId,
      },
    });

    // Recalculate scores
    const scores = this.seoScoreService.calculateScores(
      { content: post.content, slug: post.slug, title: post.title },
      seoMeta,
    );

    const updated = await this.prisma.seoMeta.update({
      where: { id: seoMeta.id },
      data: {
        seoScore: scores.seoScore,
        aeoScore: scores.aeoScore,
        geoScore: scores.geoScore,
        scoreDetails: JSON.stringify(scores.details),
      },
    });

    return updated;
  }

  async upsertForPage(identifier: string, dto: UpsertSeoDto) {
    const data: any = { ...dto };

    if (dto.lastReviewedAt) {
      data.lastReviewedAt = new Date(dto.lastReviewedAt);
    }

    const seoMeta = await this.prisma.seoMeta.upsert({
      where: { pageIdentifier: identifier },
      update: data,
      create: {
        ...data,
        pageIdentifier: identifier,
      },
    });

    return seoMeta;
  }

  async getScoreForPost(postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post #${postId} not found`);
    }

    const seoMeta = await this.prisma.seoMeta.findUnique({
      where: { postId },
    });

    const scores = this.seoScoreService.calculateScores(
      { content: post.content, slug: post.slug, title: post.title },
      seoMeta || {},
    );

    // Update cached scores if seoMeta exists
    if (seoMeta) {
      await this.prisma.seoMeta.update({
        where: { id: seoMeta.id },
        data: {
          seoScore: scores.seoScore,
          aeoScore: scores.aeoScore,
          geoScore: scores.geoScore,
          scoreDetails: JSON.stringify(scores.details),
        },
      });
    }

    return scores;
  }

  async getDashboard() {
    const [totalPosts, postsWithSeo] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.seoMeta.count({ where: { postId: { not: null } } }),
    ]);

    const seoMetas = await this.prisma.seoMeta.findMany({
      where: { postId: { not: null } },
      select: {
        postId: true,
        seoScore: true,
        aeoScore: true,
        geoScore: true,
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    const avgSeoScore =
      seoMetas.length > 0
        ? Math.round(
            seoMetas.reduce((sum, m) => sum + (m.seoScore || 0), 0) / seoMetas.length,
          )
        : 0;
    const avgAeoScore =
      seoMetas.length > 0
        ? Math.round(
            seoMetas.reduce((sum, m) => sum + (m.aeoScore || 0), 0) / seoMetas.length,
          )
        : 0;
    const avgGeoScore =
      seoMetas.length > 0
        ? Math.round(
            seoMetas.reduce((sum, m) => sum + (m.geoScore || 0), 0) / seoMetas.length,
          )
        : 0;

    const worstPosts = seoMetas
      .map((m) => ({
        postId: m.postId,
        title: m.post?.title,
        slug: m.post?.slug,
        seoScore: m.seoScore || 0,
        aeoScore: m.aeoScore || 0,
        geoScore: m.geoScore || 0,
        totalScore: (m.seoScore || 0) + (m.aeoScore || 0) + (m.geoScore || 0),
      }))
      .sort((a, b) => a.totalScore - b.totalScore)
      .slice(0, 20);

    return {
      totalPosts,
      postsWithSeo,
      averageScores: {
        seo: avgSeoScore,
        aeo: avgAeoScore,
        geo: avgGeoScore,
      },
      worstPosts,
    };
  }
}
