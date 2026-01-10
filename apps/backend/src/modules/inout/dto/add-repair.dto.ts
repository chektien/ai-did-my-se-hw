import { IsNotEmpty, IsString } from 'class-validator';

export class AddRepairDto {
  @IsString()
  description!: string;

  @IsNotEmpty()
  cost!: number;
}
