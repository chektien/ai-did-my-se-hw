import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  AddCleaningDto,
  AddRepairDto,
  AddServiceDto,
  CheckoutDto,
  ReturnDto,
  ValuationDto
} from './dto';

@Injectable()
export class InOutService {
  constructor(private prisma: PrismaService) {}

  async checkout(dto: CheckoutDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return this.prisma.$transaction(async (tx) => {
      const checkout = await tx.checkout.create({
        data: {
          bookingId: dto.bookingId,
          staffId: dto.staffId,
          signedAt: new Date(dto.signedAt),
          checklist: dto.checklist,
          mileageOut: dto.mileageOut,
          fuelLevel: dto.fuelLevel
        }
      });
      await tx.booking.update({
        where: { id: dto.bookingId },
        data: { status: 'CHECKED_OUT' }
      });
      await tx.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'RENTED' }
      });
      return checkout;
    });
  }

  async createReturn(dto: ReturnDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return this.prisma.$transaction(async (tx) => {
      const rp = await tx.returnProcess.create({
        data: {
          bookingId: dto.bookingId,
          staffId: dto.staffId,
          returnedAt: new Date(dto.returnedAt),
          mileageIn: dto.mileageIn,
          fuelLevelIn: dto.fuelLevelIn,
          damageNotes: dto.damageNotes
        }
      });
      await tx.vehicle.update({
        where: { id: booking.vehicleId },
        data: { status: 'MAINTENANCE' }
      });
      return rp;
    });
  }

  async addRepair(returnId: string, dto: AddRepairDto) {
    return this.prisma.repairItem.create({
      data: {
        returnProcessId: returnId,
        description: dto.description,
        cost: dto.cost
      }
    });
  }

  async addService(returnId: string, dto: AddServiceDto) {
    return this.prisma.serviceItem.create({
      data: {
        returnProcessId: returnId,
        description: dto.description,
        cost: dto.cost,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : null
      }
    });
  }

  async addCleaning(returnId: string, dto: AddCleaningDto) {
    return this.prisma.cleaningItem.create({
      data: {
        returnProcessId: returnId,
        description: dto.description,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : null
      }
    });
  }

  async addValuation(returnId: string, dto: ValuationDto) {
    const rp = await this.prisma.returnProcess.findUnique({ where: { id: returnId } });
    if (!rp) {
      throw new NotFoundException('Return process not found');
    }
    if (rp.stage === 'COMPLETE') {
      throw new BadRequestException('Return process already completed');
    }

    return this.prisma.$transaction(async (tx) => {
      const valuation = await tx.valuation.create({
        data: {
          returnProcessId: returnId,
          assessedValue: dto.assessedValue,
          decision: dto.decision,
          remarks: dto.remarks
        }
      });
      await tx.returnProcess.update({
        where: { id: returnId },
        data: { stage: 'COMPLETE' }
      });

      const booking = await tx.booking.findUnique({ where: { id: rp.bookingId } });
      if (booking) {
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: 'RETURNED' }
        });
        const status = dto.decision === 'RETURN_TO_INVENTORY' ? 'AVAILABLE' : 'RETIRED';
        await tx.vehicle.update({
          where: { id: booking.vehicleId },
          data: { status }
        });
      }
      return valuation;
    });
  }

  listReturns() {
    return this.prisma.returnProcess.findMany({
      include: { repairItems: true, serviceItems: true, cleaningItems: true, valuation: true }
    });
  }
}
