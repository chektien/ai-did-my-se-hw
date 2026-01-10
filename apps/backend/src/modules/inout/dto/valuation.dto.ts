import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValuationDecision } from '@prisma/client';

export class ValuationDto {
  @IsNotEmpty()
  assessedValue!: number;

  @IsEnum(ValuationDecision)
  decision!: ValuationDecision;

  @IsOptional()
  @IsString()
  remarks?: string;
}
