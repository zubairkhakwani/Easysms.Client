import { parsePhoneNumber } from "libphonenumber-js";

export const FormatterHelper = {
  formatNumber: (value, locale = navigator.language) => {
    if (value === null || value === undefined) return "0";

    const num = typeof value === "number" ? value : Number(value);
    if (isNaN(num)) return "0";

    return new Intl.NumberFormat(locale).format(num);
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

  formatDateToLocal: (date) => {
    //new Date(date) will auto convert to local timezone.
    const localDate = new Date(date);

    //en-US is a formate not timezone.
    const formattedDate = localDate.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formattedDate;
  },
};
