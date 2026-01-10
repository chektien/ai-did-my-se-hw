import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInsuranceDto {
  @IsString()
  name!: string;

  @IsNotEmpty()
  pricePerDay!: number;

  @IsOptional()
  @IsInt()
  kmLimit?: number;

  @IsOptional()
  @IsBoolean()
  includesChips?: boolean;

  @IsOptional()
  @IsBoolean()
  includesCdw?: boolean;

  @IsOptional()
  @IsBoolean()
  unlimitedKm?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
