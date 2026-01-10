import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ItemType } from '@prisma/client';

export class CreateProcurementDto {
  @IsString()
  sourceId!: string;

  @IsEnum(ItemType)
  itemType!: ItemType;

  @IsString()
  itemName!: string;

  @IsInt()
  quantity!: number;

  @IsNotEmpty()
  cost!: number;
}
