import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { UpdateFlagsDto } from './dto/update-flags.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('api/admin/posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: QueryPostsDto) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.toggleActive(id);
  }

  @Patch(':id/flags')
  updateFlags(
    @Param('id', ParseIntPipe) id: number,
    @Body() flags: UpdateFlagsDto,
  ) {
    return this.postsService.updateFlags(id, flags);
  }
}
