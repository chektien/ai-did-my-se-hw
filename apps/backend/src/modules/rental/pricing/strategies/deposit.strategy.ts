import { PricingStrategy } from '../pricing-strategy';
import { QuoteContext } from '../quote-context';

export class DepositStrategy implements PricingStrategy {
  private calcAge(dob: Date) {
    const now = new Date();
    const years = now.getUTCFullYear() - dob.getUTCFullYear();
    const m = now.getUTCMonth() - dob.getUTCMonth();
    return m < 0 || (m == 0 && now.getUTCDate() < dob.getUTCDate()) ? years - 1 : years;
  }

  private calcYearsSince(date: Date) {
    const now = new Date();
    let years = now.getUTCFullYear() - date.getUTCFullYear();
    const m = now.getUTCMonth() - date.getUTCMonth();
    if (m < 0 || (m == 0 && now.getUTCDate() < date.getUTCDate())) {
      years -= 1;
    }
    return years;
  }

  apply(context: QuoteContext): QuoteContext {
    let deposit = 300;
    for (const driver of context.drivers) {
      const age = this.calcAge(new Date(driver.dob));
      const yearsLicensed = this.calcYearsSince(new Date(driver.licenseIssuedAt));
      if (age < 22 || yearsLicensed < 2) {
        deposit += 200;
        break;
      }
    }
    return { ...context, deposit };
  }
}
