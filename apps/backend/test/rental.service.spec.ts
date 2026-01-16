import { Test, TestingModule } from '@nestjs/testing';
import { RentalService } from '../src/modules/rental/rental.service';
import { PrismaService } from '../src/common/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RentalService', () => {
  let service: RentalService;
  let prismaService: PrismaService;

  const mockVehicle = {
    id: 'v1',
    plate: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    dailyRate: 100,
  };

  const mockInsurance = {
    id: 'i1',
    name: 'Basic',
    pricePerDay: 25,
  };

  const mockAddon = {
    id: 'a1',
    name: 'GPS',
    pricePerRental: 20,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      vehicle: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      insurancePlan: {
        findUnique: jest.fn(),
      },
      addon: {
        findMany: jest.fn(),
      },
      booking: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RentalService>(RentalService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('quote', () => {
    it('should generate a quote successfully', async () => {
      jest.spyOn(prismaService.vehicle, 'findUnique').mockResolvedValue(mockVehicle as any);
      jest.spyOn(prismaService.insurancePlan, 'findUnique').mockResolvedValue(mockInsurance as any);
      jest.spyOn(prismaService.addon, 'findMany').mockResolvedValue([mockAddon] as any);

      const quoteDto = {
        vehicleId: 'v1',
        insurancePlanId: 'i1',
        startAt: '2024-01-01',
        endAt: '2024-01-04',
        pickupAt: '2024-01-01T10:00:00',
        returnAt: '2024-01-04T10:00:00',
        drivers: [
          {
            name: 'John Doe',
            licenseNo: 'S1234567A',
            licenseIssuedAt: '2021-01-01',
            dob: '1990-01-01',
          },
        ],
        addons: [{ addonId: 'a1', quantity: 1 }],
        payFullUpfront: false,
      };

      const result = await service.quote(quoteDto);

      expect(result).toHaveProperty('days');
      expect(result).toHaveProperty('base');
      expect(result).toHaveProperty('total');
      expect(result.days).toBe(3);
      expect(result.base).toBe(300); // 100 * 3 days
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      jest.spyOn(prismaService.vehicle, 'findUnique').mockResolvedValue(null);

      const quoteDto = {
        vehicleId: 'invalid',
        insurancePlanId: 'i1',
        startAt: '2024-01-01',
        endAt: '2024-01-04',
        pickupAt: '2024-01-01T10:00:00',
        returnAt: '2024-01-04T10:00:00',
        drivers: [],
        addons: [],
        payFullUpfront: false,
      };

      await expect(service.quote(quoteDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when insurance not found', async () => {
      jest.spyOn(prismaService.vehicle, 'findUnique').mockResolvedValue(mockVehicle as any);
      jest.spyOn(prismaService.insurancePlan, 'findUnique').mockResolvedValue(null);

      const quoteDto = {
        vehicleId: 'v1',
        insurancePlanId: 'invalid',
        startAt: '2024-01-01',
        endAt: '2024-01-04',
        pickupAt: '2024-01-01T10:00:00',
        returnAt: '2024-01-04T10:00:00',
        drivers: [],
        addons: [],
        payFullUpfront: false,
      };

      await expect(service.quote(quoteDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      jest.spyOn(prismaService.vehicle, 'findUnique').mockResolvedValue(mockVehicle as any);
      jest.spyOn(prismaService.insurancePlan, 'findUnique').mockResolvedValue(mockInsurance as any);
      jest.spyOn(prismaService.addon, 'findMany').mockResolvedValue([mockAddon] as any);

      const mockCreatedBooking = {
        id: 'b1',
        userId: 'u1',
        vehicleId: 'v1',
        status: 'PENDING',
        drivers: [],
        addons: [],
        payments: [],
      };

      jest.spyOn(prismaService.booking, 'create').mockResolvedValue(mockCreatedBooking as any);

      const createDto = {
        userId: 'u1',
        vehicleId: 'v1',
        insurancePlanId: 'i1',
        startAt: '2024-01-01',
        endAt: '2024-01-04',
        pickupAt: '2024-01-01T10:00:00',
        returnAt: '2024-01-04T10:00:00',
        drivers: [
          {
            name: 'John Doe',
            licenseNo: 'S1234567A',
            licenseIssuedAt: '2021-01-01',
            dob: '1990-01-01',
          },
        ],
        addons: [{ addonId: 'a1', quantity: 1 }],
        payFullUpfront: false,
      };

      const result = await service.createBooking(createDto);

      expect(result).toEqual(mockCreatedBooking);
      expect(prismaService.booking.create).toHaveBeenCalled();
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking when within cancellation window', async () => {
      const mockBooking = {
        id: 'b1',
        pickupAt: new Date('2024-01-01T10:00:00'),
      };

      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(mockBooking as any);
      jest.spyOn(prismaService.booking, 'update').mockResolvedValue({ ...mockBooking, status: 'CANCELLED' } as any);

      const result = await service.cancelBooking('b1', { now: '2024-01-01T06:00:00' });

      expect(result.status).toBe('CANCELLED');
    });

    it('should throw BadRequestException when cancellation window has passed', async () => {
      const mockBooking = {
        id: 'b1',
        pickupAt: new Date('2024-01-01T10:00:00'),
      };

      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(mockBooking as any);

      await expect(
        service.cancelBooking('b1', { now: '2024-01-01T09:00:00' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when booking not found', async () => {
      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(null);

      await expect(
        service.cancelBooking('invalid', { now: '2024-01-01T06:00:00' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listBookings', () => {
    it('should return all bookings', async () => {
      const mockBookings = [
        { id: 'b1', status: 'PENDING' },
        { id: 'b2', status: 'CONFIRMED' },
      ];

      jest.spyOn(prismaService.booking, 'findMany').mockResolvedValue(mockBookings as any);

      const result = await service.listBookings();

      expect(result).toEqual(mockBookings);
      expect(result.length).toBe(2);
    });
  });

  describe('getBooking', () => {
    it('should return a booking by id', async () => {
      const mockBooking = { id: 'b1', status: 'PENDING' };

      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(mockBooking as any);

      const result = await service.getBooking('b1');

      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException when booking not found', async () => {
      jest.spyOn(prismaService.booking, 'findUnique').mockResolvedValue(null);

      await expect(service.getBooking('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
