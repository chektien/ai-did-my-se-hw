import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddonDto {
  @IsString()
  name!: string;

  @IsNotEmpty()
  pricePerRental!: number;

  @IsInt()
  stock!: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
