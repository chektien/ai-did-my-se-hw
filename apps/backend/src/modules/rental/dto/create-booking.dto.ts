import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DriverDto {
  @IsString()
  name!: string;

  @IsString()
  licenseNo!: string;

  @IsDateString()
  licenseIssuedAt!: string;

  @IsDateString()
  dob!: string;
}

class AddonDto {
  @IsString()
  addonId!: string;

  @IsNotEmpty()
  quantity!: number;
}

export class CreateBookingDto {
  @IsString()
  userId!: string;

  @IsString()
  vehicleId!: string;

  @IsString()
  insurancePlanId!: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;

  @IsDateString()
  pickupAt!: string;

  @IsDateString()
  returnAt!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DriverDto)
  drivers!: DriverDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonDto)
  addons!: AddonDto[];

  @IsBoolean()
  payFullUpfront!: boolean;
}
