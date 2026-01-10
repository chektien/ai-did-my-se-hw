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

export class QuoteDto {
  @IsString()
  vehicleId!: string;

  @IsString()
  insurancePlanId!: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;

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
