import { QuoteContext } from './quote-context';

export interface PricingStrategy {
  apply(context: QuoteContext): QuoteContext;
}
