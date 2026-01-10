import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @IsString()
  plate!: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  year!: number;

  @IsString()
  color!: string;

  @IsInt()
  seats!: number;

  @IsOptional()
  @IsString()
  bootCapacity?: string;

  @IsNotEmpty()
  dailyRate!: number;

  @IsOptional()
  @IsInt()
  mileage?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
