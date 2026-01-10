import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InOutService } from './inout.service';
import {
  AddCleaningDto,
  AddRepairDto,
  AddServiceDto,
  CheckoutDto,
  ReturnDto,
  ValuationDto
} from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('inout')
@UseGuards(JwtAuthGuard)
export class InOutController {
  constructor(private readonly inoutService: InOutService) {}

  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.inoutService.checkout(dto);
  }

  @Post('return')
  createReturn(@Body() dto: ReturnDto) {
    return this.inoutService.createReturn(dto);
  }

  @Post('return/:id/repair')
  addRepair(@Param('id') id: string, @Body() dto: AddRepairDto) {
    return this.inoutService.addRepair(id, dto);
  }

  @Post('return/:id/service')
  addService(@Param('id') id: string, @Body() dto: AddServiceDto) {
    return this.inoutService.addService(id, dto);
  }

  @Post('return/:id/cleaning')
  addCleaning(@Param('id') id: string, @Body() dto: AddCleaningDto) {
    return this.inoutService.addCleaning(id, dto);
  }

  @Post('return/:id/valuation')
  addValuation(@Param('id') id: string, @Body() dto: ValuationDto) {
    return this.inoutService.addValuation(id, dto);
  }

  @Get('returns')
  listReturns() {
    return this.inoutService.listReturns();
  }
}
