import { PricingStrategy } from '../pricing-strategy';
import { QuoteContext } from '../quote-context';

export class BaseRateStrategy implements PricingStrategy {
  apply(context: QuoteContext): QuoteContext {
    const base = Number(context.vehicle.dailyRate) * context.days;
    return { ...context, base };
  }
}
