import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateBookingDto, QuoteDto, CancelBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('rental')
@UseGuards(JwtAuthGuard)
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post('quote')
  async quote(@Body() dto: QuoteDto) {
    return this.rentalService.quote(dto);
  }

  @Post('bookings')
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.rentalService.createBooking(dto);
  }

  @Get('bookings')
  async listBookings() {
    return this.rentalService.listBookings();
  }

  @Get('bookings/:id')
  async getBooking(@Param('id') id: string) {
    return this.rentalService.getBooking(id);
  }

  @Post('bookings/:id/cancel')
  async cancelBooking(@Param('id') id: string, @Body() dto: CancelBookingDto) {
    return this.rentalService.cancelBooking(id, dto);
  }
}
