import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UploadService } from './upload.service';

const imageFileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  if (!allowed.test(file.originalname)) {
    return callback(
      new BadRequestException('Only image files are allowed (jpg, jpeg, png, gif, webp, svg)'),
      false,
    );
  }
  callback(null, true);
};

@Controller('api/admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const image = await this.uploadService.saveImage(file);
    return { url: image.path, ...image };
  }

  @Get('images')
  findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPageNum = Math.min(100, Math.max(1, parseInt(perPage, 10) || 20));

    return this.uploadService.findAll(pageNum, perPageNum);
  }

  @Delete('images/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uploadService.remove(id);
  }
}
