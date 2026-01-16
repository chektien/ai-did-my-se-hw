import { BaseRateStrategy } from '../src/modules/rental/pricing/strategies/base-rate.strategy';
import { InsuranceStrategy } from '../src/modules/rental/pricing/strategies/insurance.strategy';
import { AddonStrategy } from '../src/modules/rental/pricing/strategies/addon.strategy';
import { ExtraDriverStrategy } from '../src/modules/rental/pricing/strategies/extra-driver.strategy';
import { DepositStrategy } from '../src/modules/rental/pricing/strategies/deposit.strategy';
import { DiscountStrategy } from '../src/modules/rental/pricing/strategies/discount.strategy';
import { QuoteContext } from '../src/modules/rental/pricing/quote-context';

describe('Pricing Strategies', () => {
  describe('BaseRateStrategy', () => {
    it('should calculate base rate correctly', () => {
      const strategy = new BaseRateStrategy();
      const context: QuoteContext = {
        vehicle: { dailyRate: 100 } as any,
        insurance: {} as any,
        addons: [],
        drivers: [],
        days: 3,
        payFullUpfront: false,
        base: 0,
        insuranceTotal: 0,
        addonTotal: 0,
        extraDriverFee: 0,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.base).toBe(300);
    });

    it('should handle single day rental', () => {
      const strategy = new BaseRateStrategy();
      const context: QuoteContext = {
        vehicle: { dailyRate: 150 } as any,
        insurance: {} as any,
        addons: [],
        drivers: [],
        days: 1,
        payFullUpfront: false,
        base: 0,
        insuranceTotal: 0,
        addonTotal: 0,
        extraDriverFee: 0,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.base).toBe(150);
    });
  });

  describe('InsuranceStrategy', () => {
    it('should calculate insurance cost correctly', () => {
      const strategy = new InsuranceStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: { pricePerDay: 25 } as any,
        addons: [],
        drivers: [],
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 0,
        addonTotal: 0,
        extraDriverFee: 0,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.insuranceTotal).toBe(75);
    });
  });

  describe('AddonStrategy', () => {
    it('should calculate addon costs correctly', () => {
      const strategy = new AddonStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [
          { addon: { pricePerRental: 20 } as any, quantity: 2 },
          { addon: { pricePerRental: 15 } as any, quantity: 1 },
        ],
        drivers: [],
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 0,
        extraDriverFee: 0,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.addonTotal).toBe(55); // 20*2 + 15*1
    });

    it('should handle no addons', () => {
      const strategy = new AddonStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [],
        drivers: [],
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 0,
        extraDriverFee: 0,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.addonTotal).toBe(0);
    });
  });

  describe('ExtraDriverStrategy', () => {
    it('should charge fee for extra drivers', () => {
      const strategy = new ExtraDriverStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [],
        drivers: [{ name: 'Driver 1' }, { name: 'Driver 2' }] as any,
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 0,
        extraDriverFee: 0,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.extraDriverFee).toBe(20); // 1 extra driver * $20
    });

    it('should not charge for single driver', () => {
      const strategy = new ExtraDriverStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [],
        drivers: [{ name: 'Driver 1' }] as any,
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 0,
        extraDriverFee: 0,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.extraDriverFee).toBe(0);
    });
  });

  describe('DepositStrategy', () => {
    it('should calculate deposit for experienced driver', () => {
      const strategy = new DepositStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [],
        drivers: [
          {
            name: 'Driver 1',
            dob: '1990-01-01',
            licenseIssuedAt: '2010-01-01',
          },
        ] as any,
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 55,
        extraDriverFee: 20,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.deposit).toBe(300); // Base deposit for experienced driver
    });

    it('should add surcharge for young or inexperienced driver', () => {
      const strategy = new DepositStrategy();
      const currentYear = new Date().getFullYear();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [],
        drivers: [
          {
            name: 'Young Driver',
            dob: `${currentYear - 20}-01-01`, // 20 years old (< 22)
            licenseIssuedAt: `${currentYear - 1}-01-01`, // 1 year licensed (< 2)
          },
        ] as any,
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 55,
        extraDriverFee: 20,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.deposit).toBe(500); // Base 300 + 200 surcharge
    });
  });

  describe('DiscountStrategy', () => {
    it('should calculate total without discount when not paying full upfront', () => {
      const strategy = new DiscountStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [],
        drivers: [],
        days: 3,
        payFullUpfront: false,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 55,
        extraDriverFee: 20,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.total).toBe(450); // 300 + 75 + 55 + 20
    });

    it('should apply 2% discount when paying full upfront', () => {
      const strategy = new DiscountStrategy();
      const context: QuoteContext = {
        vehicle: {} as any,
        insurance: {} as any,
        addons: [],
        drivers: [],
        days: 3,
        payFullUpfront: true,
        base: 300,
        insuranceTotal: 75,
        addonTotal: 55,
        extraDriverFee: 20,
        deposit: 0,
        total: 0,
      };

      const result = strategy.apply(context);
      expect(result.total).toBe(441); // (300 + 75 + 55 + 20) * 0.98
    });
  });
});
