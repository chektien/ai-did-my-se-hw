import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AddCleaningDto {
  @IsString()
  description!: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
