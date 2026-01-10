import { IsDateString } from 'class-validator';

export class CancelBookingDto {
  @IsDateString()
  now!: string;
}
