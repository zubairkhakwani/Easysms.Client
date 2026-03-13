import { parsePhoneNumber } from "libphonenumber-js";

export const FormatterHelper = {
  formatNumber: (number, locale = navigator.language) => {
    return new Intl.NumberFormat(locale).format(number);
  },

  formatCurrency: (number, currency = "USD", locale = "en-US") => {
    const truncated = Math.trunc(number * 10000) / 10000;

    const decimals = truncated % 1 === 0 ? 0 : 4;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currencyDisplay: "symbol",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(truncated);
  },

  formatPhoneNumber: (number) => {
    try {
      const phone = parsePhoneNumber("+" + number);
      return phone.formatInternational();
    } catch {
      return number; // fallback to raw if invalid
    }
  },
};
