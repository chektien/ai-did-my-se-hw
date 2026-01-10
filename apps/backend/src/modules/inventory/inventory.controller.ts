import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateAddonDto,
  CreateCategoryDto,
  CreateInsuranceDto,
  CreateProcurementDto,
  CreateSourceDto,
  CreateVehicleDto
} from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('vehicles')
  listVehicles() {
    return this.inventoryService.listVehicles();
  }

  @Post('vehicles')
  createVehicle(@Body() dto: CreateVehicleDto) {
    return this.inventoryService.createVehicle(dto);
  }

  @Get('categories')
  listCategories() {
    return this.inventoryService.listCategories();
  }

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.inventoryService.createCategory(dto);
  }

  @Get('addons')
  listAddons() {
    return this.inventoryService.listAddons();
  }

  @Post('addons')
  createAddon(@Body() dto: CreateAddonDto) {
    return this.inventoryService.createAddon(dto);
  }

  @Get('insurance-plans')
  listInsurancePlans() {
    return this.inventoryService.listInsurancePlans();
  }

  @Post('insurance-plans')
  createInsurancePlan(@Body() dto: CreateInsuranceDto) {
    return this.inventoryService.createInsurancePlan(dto);
  }

  @Get('sources')
  listSources() {
    return this.inventoryService.listSources();
  }

  @Post('sources')
  createSource(@Body() dto: CreateSourceDto) {
    return this.inventoryService.createSource(dto);
  }

  @Post('procurements')
  createProcurement(@Body() dto: CreateProcurementDto) {
    return this.inventoryService.createProcurement(dto);
  }
}
