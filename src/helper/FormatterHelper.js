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
    if (!date) return "-";

    let localDate = new Date(date);

    // Handle dd.MM.yyyy format if normal parsing fails
    if (isNaN(localDate)) {
      const parts = date.split(".");

      if (parts.length === 3) {
        const [day, month, year] = parts;
        localDate = new Date(year, month - 1, day);
      }
    }

    // Final safety check
    if (isNaN(localDate)) return "-";

    return localDate.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  },
};
