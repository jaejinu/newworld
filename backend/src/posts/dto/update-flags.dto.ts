import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateFlagsDto {
  @IsOptional()
  @IsBoolean()
  recommended?: boolean;

  @IsOptional()
  @IsBoolean()
  noticePost?: boolean;

  @IsOptional()
  @IsBoolean()
  editorPick?: boolean;
}
