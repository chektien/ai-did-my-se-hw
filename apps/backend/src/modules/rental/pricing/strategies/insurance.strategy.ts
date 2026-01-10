import { PricingStrategy } from '../pricing-strategy';
import { QuoteContext } from '../quote-context';

export class InsuranceStrategy implements PricingStrategy {
  apply(context: QuoteContext): QuoteContext {
    const insuranceTotal = Number(context.insurance.pricePerDay) * context.days;
    return { ...context, insuranceTotal };
  }
}
