import { IsOptional, IsString } from 'class-validator';

export class UpsertSeoDto {
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDescription?: string;
  @IsOptional() @IsString() canonicalUrl?: string;
  @IsOptional() @IsString() ogTitle?: string;
  @IsOptional() @IsString() ogDescription?: string;
  @IsOptional() @IsString() ogImage?: string;
  @IsOptional() @IsString() ogType?: string;
  @IsOptional() @IsString() twitterCard?: string;
  @IsOptional() @IsString() robotsMeta?: string;
  @IsOptional() @IsString() focusKeyword?: string;
  @IsOptional() @IsString() jsonLdType?: string;
  @IsOptional() @IsString() jsonLdData?: string;
  @IsOptional() @IsString() faqItems?: string;
  @IsOptional() @IsString() howToSteps?: string;
  @IsOptional() @IsString() tldrSummary?: string;
  @IsOptional() @IsString() lastReviewedAt?: string;
  @IsOptional() @IsString() localBusinessData?: string;
  @IsOptional() @IsString() serviceArea?: string;
  @IsOptional() @IsString() localKeywords?: string;
}
