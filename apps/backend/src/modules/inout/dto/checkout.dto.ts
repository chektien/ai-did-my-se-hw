import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @IsString()
  bookingId!: string;

  @IsOptional()
  @IsString()
  staffId?: string;

  @IsDateString()
  signedAt!: string;

  @IsNotEmpty()
  checklist!: Record<string, boolean>;

  @IsNotEmpty()
  mileageOut!: number;

  @IsString()
  fuelLevel!: string;
}
