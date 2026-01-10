import { Addon, InsurancePlan, Vehicle } from '@prisma/client';
import { QuoteDriverInput } from './types';

export type QuoteContext = {
  vehicle: Vehicle;
  insurance: InsurancePlan;
  addons: { addon: Addon; quantity: number }[];
  drivers: QuoteDriverInput[];
  days: number;
  payFullUpfront: boolean;
  base: number;
  insuranceTotal: number;
  addonTotal: number;
  extraDriverFee: number;
  deposit: number;
  total: number;
};
