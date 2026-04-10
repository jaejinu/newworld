import { IsString, IsInt, IsOptional, IsEmail } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  postId: number;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsString()
  author: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  content: string;
}
