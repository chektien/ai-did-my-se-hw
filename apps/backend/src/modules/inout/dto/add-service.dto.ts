import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddServiceDto {
  @IsString()
  description!: string;

  @IsNotEmpty()
  cost!: number;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
