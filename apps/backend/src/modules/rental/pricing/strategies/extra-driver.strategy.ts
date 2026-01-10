import { PricingStrategy } from '../pricing-strategy';
import { QuoteContext } from '../quote-context';

export class ExtraDriverStrategy implements PricingStrategy {
  apply(context: QuoteContext): QuoteContext {
    const extraDrivers = Math.max(0, context.drivers.length - 1);
    const extraDriverFee = extraDrivers * 20;
    return { ...context, extraDriverFee };
  }
}
