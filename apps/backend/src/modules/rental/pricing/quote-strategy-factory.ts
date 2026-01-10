import { PricingStrategy } from './pricing-strategy';
import { AddonStrategy } from './strategies/addon.strategy';
import { BaseRateStrategy } from './strategies/base-rate.strategy';
import { DepositStrategy } from './strategies/deposit.strategy';
import { DiscountStrategy } from './strategies/discount.strategy';
import { ExtraDriverStrategy } from './strategies/extra-driver.strategy';
import { InsuranceStrategy } from './strategies/insurance.strategy';

export class QuoteStrategyFactory {
  createStrategies(): PricingStrategy[] {
    return [
      new BaseRateStrategy(),
      new InsuranceStrategy(),
      new AddonStrategy(),
      new ExtraDriverStrategy(),
      new DepositStrategy(),
      new DiscountStrategy()
    ];
  }
}
