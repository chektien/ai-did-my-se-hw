import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateBookingDto, QuoteDto, CancelBookingDto } from './dto';
import { QuoteCalculator } from './pricing/quote-calculator';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  private quoteCalculator = new QuoteCalculator();

  private calcDays(startAt: Date, endAt: Date) {
    const diff = endAt.getTime() - startAt.getTime();
    return Math.max(1, Math.ceil(diff / MS_PER_DAY));
  }

  async quote(dto: QuoteDto) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: dto.vehicleId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    const insurance = await this.prisma.insurancePlan.findUnique({ where: { id: dto.insurancePlanId } });
    if (!insurance) {
      throw new NotFoundException('Insurance plan not found');
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);
    const days = this.calcDays(startAt, endAt);

    const addons = await this.prisma.addon.findMany({
      where: { id: { in: dto.addons.map((a) => a.addonId) } }
    });
    const addonInputs = dto.addons.map((item) => {
      const addon = addons.find((record) => record.id === item.addonId);
      if (!addon) {
        throw new NotFoundException('Addon not found');
      }
      return { addon, quantity: item.quantity };
    });

    return this.quoteCalculator.calculate({
      vehicle,
      insurance,
      addons: addonInputs,
      drivers: dto.drivers,
      days,
      payFullUpfront: dto.payFullUpfront,
      base: 0,
      insuranceTotal: 0,
      addonTotal: 0,
      extraDriverFee: 0,
      deposit: 0,
      total: 0
    });
  }

  async createBooking(dto: CreateBookingDto) {
    const quote = await this.quote(dto);
    const addonRecords = await this.prisma.addon.findMany({
      where: { id: { in: dto.addons.map((a) => a.addonId) } }
    });
    const booking = await this.prisma.booking.create({
      data: {
        userId: dto.userId,
        vehicleId: dto.vehicleId,
        insurancePlanId: dto.insurancePlanId,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        pickupAt: new Date(dto.pickupAt),
        returnAt: new Date(dto.returnAt),
        status: 'PENDING',
        totalQuote: quote.total,
        deposit: quote.deposit,
        holdingFee: dto.payFullUpfront ? 0 : 50,
        payFullUpfront: dto.payFullUpfront,
        drivers: {
          create: dto.drivers.map((d) => ({
            name: d.name,
            licenseNo: d.licenseNo,
            licenseIssuedAt: new Date(d.licenseIssuedAt),
            dob: new Date(d.dob)
          }))
        },
        addons: {
          create: dto.addons.map((a) => {
            const addon = addonRecords.find((record) => record.id === a.addonId);
            if (!addon) {
              throw new NotFoundException('Addon not found');
            }
            return {
              addonId: a.addonId,
              quantity: a.quantity,
              price: addon.pricePerRental
            };
          })
        },
        payments: {
          create: [
            {
              amount: dto.payFullUpfront ? quote.total : 50,
              kind: dto.payFullUpfront ? 'FULL' : 'HOLDING',
              status: 'PAID'
            }
          ]
        }
      },
      include: { drivers: true, addons: true, payments: true }
    });
    return booking;
  }

  async listBookings() {
    return this.prisma.booking.findMany({
      include: { drivers: true, addons: true, payments: true, vehicle: true }
    });
  }

  async getBooking(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { drivers: true, addons: true, payments: true, vehicle: true }
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async cancelBooking(id: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    const pickupAt = booking.pickupAt;
    const hoursToPickup = (pickupAt.getTime() - new Date(dto.now).getTime()) / (60 * 60 * 1000);
    if (hoursToPickup < 2) {
      throw new BadRequestException('Cancellation window has passed');
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
  }
}
