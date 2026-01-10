import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  CreateAddonDto,
  CreateCategoryDto,
  CreateInsuranceDto,
  CreateProcurementDto,
  CreateSourceDto,
  CreateVehicleDto
} from './dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  listVehicles() {
    return this.prisma.vehicle.findMany({ include: { category: true } });
  }

  createVehicle(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({ data: dto });
  }

  listCategories() {
    return this.prisma.vehicleCategory.findMany();
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.vehicleCategory.create({ data: dto });
  }

  listAddons() {
    return this.prisma.addon.findMany();
  }

  createAddon(dto: CreateAddonDto) {
    return this.prisma.addon.create({ data: dto });
  }

  listInsurancePlans() {
    return this.prisma.insurancePlan.findMany();
  }

  createInsurancePlan(dto: CreateInsuranceDto) {
    return this.prisma.insurancePlan.create({ data: dto });
  }

  listSources() {
    return this.prisma.inventorySource.findMany();
  }

  createSource(dto: CreateSourceDto) {
    return this.prisma.inventorySource.create({ data: dto });
  }

  createProcurement(dto: CreateProcurementDto) {
    return this.prisma.procurement.create({ data: dto });
  }
}
