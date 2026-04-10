import { Controller, Get, Post, Param, Query, Body, ParseIntPipe } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';

@Controller('api')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @Get('posts')
  getPosts(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('itemType') itemType?: string,
  ) {
    return this.publicApiService.getPosts({
      page: page ? parseInt(page, 10) : undefined,
      perPage: perPage ? parseInt(perPage, 10) : undefined,
      category,
      search,
      itemType,
    });
  }

  @Get('posts/:categorySlug/:postSlug')
  getPost(
    @Param('categorySlug') categorySlug: string,
    @Param('postSlug') postSlug: string,
  ) {
    return this.publicApiService.getPost(categorySlug, postSlug);
  }

  @Get('posts/:categorySlug/:postSlug/adjacent')
  getAdjacentPosts(
    @Param('categorySlug') categorySlug: string,
    @Param('postSlug') postSlug: string,
  ) {
    return this.publicApiService.getAdjacentPosts(categorySlug, postSlug);
  }

  @Get('categories')
  getCategories() {
    return this.publicApiService.getCategories();
  }

  @Get('comments/:postId')
  getComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.publicApiService.getComments(postId);
  }

  @Post('comments')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.publicApiService.createComment(createCommentDto);
  }

  @Get('seo/post/:postId')
  getSeoMeta(@Param('postId', ParseIntPipe) postId: number) {
    return this.publicApiService.getSeoMeta(postId);
  }

  @Get('seo/page/:identifier')
  getPageSeoMeta(@Param('identifier') identifier: string) {
    return this.publicApiService.getPageSeoMeta(identifier);
  }
}
