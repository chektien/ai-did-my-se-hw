import { QuoteContext } from './quote-context';
import { QuoteStrategyFactory } from './quote-strategy-factory';

export class QuoteCalculator {
  private factory = new QuoteStrategyFactory();

  calculate(context: QuoteContext) {
    return this.factory
      .createStrategies()
      .reduce((current, strategy) => strategy.apply(current), context);
  }
}
