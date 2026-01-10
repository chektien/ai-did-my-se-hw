import { PricingStrategy } from '../pricing-strategy';
import { QuoteContext } from '../quote-context';

export class DiscountStrategy implements PricingStrategy {
  apply(context: QuoteContext): QuoteContext {
    let total = context.base + context.insuranceTotal + context.addonTotal + context.extraDriverFee;
    if (context.payFullUpfront) {
      total = Number((total * 0.98).toFixed(2));
    }
    return { ...context, total };
  }
}
