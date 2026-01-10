import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SourceCategory } from '@prisma/client';

export class CreateSourceDto {
  @IsString()
  name!: string;

  @IsEnum(SourceCategory)
  category!: SourceCategory;

  @IsOptional()
  @IsString()
  contact?: string;
}
