import { PricingStrategy } from '../pricing-strategy';
import { QuoteContext } from '../quote-context';

export class AddonStrategy implements PricingStrategy {
  apply(context: QuoteContext): QuoteContext {
    const addonTotal = context.addons.reduce((sum, item) => {
      return sum + Number(item.addon.pricePerRental) * item.quantity;
    }, 0);
    return { ...context, addonTotal };
  }
}
