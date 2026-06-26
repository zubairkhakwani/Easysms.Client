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
      const normalized = number.startsWith("+") ? number : `+${number}`;
      const phone = parsePhoneNumber(normalized);
      return phone.formatInternational();
    } catch {
      return number;
    }
  },

  formatDateToLocal: (date) => {
    if (!date) return "-";

    let localDate;

    // Try dd.MM.yyyy or dd.MM.yyyy HH:mm:ss format first
    const ddMmYyyy =
      /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = String(date).trim().match(ddMmYyyy);

    if (match) {
      const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] =
        match;
      localDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    } else {
      // Fall back to native parsing (ISO 8601, etc.)
      localDate = new Date(date);
    }

    if (isNaN(localDate.getTime())) return "-";

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
