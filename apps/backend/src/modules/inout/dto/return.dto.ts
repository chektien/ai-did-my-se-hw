import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReturnDto {
  @IsString()
  bookingId!: string;

  @IsOptional()
  @IsString()
  staffId?: string;

  @IsDateString()
  returnedAt!: string;

  @IsNotEmpty()
  mileageIn!: number;

  @IsString()
  fuelLevelIn!: string;

  @IsOptional()
  @IsString()
  damageNotes?: string;
}
