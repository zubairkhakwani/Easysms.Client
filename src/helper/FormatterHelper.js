import { parsePhoneNumber } from "libphonenumber-js";

export const FormatterHelper = {
  formatNumber: (value, locale = navigator.language) => {
    if (value === null || value === undefined) return "0";

    const num = typeof value === "number" ? value : Number(value);
    if (isNaN(num)) return "0";

    return new Intl.NumberFormat(locale).format(num);
  },

  truncateDecimals(value, decimals = 4) {
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    const factor = 10 ** decimals;
    return Math.trunc(num * factor) / factor;
  },

  formatDecimal(value, decimals = 4) {
    const truncated = FormatterHelper.truncateDecimals(value, decimals);
    if (truncated === null) return "";
    return String(truncated);
  },

  formatCurrency: (number, currency = "USD", locale = "en-US") => {
    const truncated = FormatterHelper.truncateDecimals(number, 4);

    if (truncated === null) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currencyDisplay: "symbol",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(0);
    }

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

    const trimmed = String(date).trim();

    // DateOnly / date picker values: "2026-06-28" — local calendar date, no time
    const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
    const isoDateMatch = trimmed.match(isoDateOnly);

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      const localDate = new Date(+year, +month - 1, +day);
      if (isNaN(localDate.getTime())) return "-";

      return localDate.toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    let localDate;

    // Try dd.MM.yyyy or dd.MM.yyyy HH:mm:ss format first
    const ddMmYyyy =
      /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = trimmed.match(ddMmYyyy);

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

  formatElapsedSince: (date) => {
    if (!date) return "—";

    const start = new Date(date);
    if (isNaN(start.getTime())) return "—";

    const diffMs = Date.now() - start.getTime();
    if (diffMs < 0) return "0m";

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return "<1m";
  },

  /** Parse common API date strings into a local Date, or null. */
  parseLocalDate: (date) => {
    if (!date) return null;

    const trimmed = String(date).trim();
    const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
    const isoDateMatch = trimmed.match(isoDateOnly);

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      const localDate = new Date(+year, +month - 1, +day);
      return isNaN(localDate.getTime()) ? null : localDate;
    }

    const ddMmYyyy =
      /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = trimmed.match(ddMmYyyy);

    let localDate;
    if (match) {
      const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] =
        match;
      localDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    } else {
      localDate = new Date(date);
    }

    return isNaN(localDate.getTime()) ? null : localDate;
  },

  /**
   * Relative expiry for proxies.
   * tone: "ok" | "soon" | "expired"
   * soon = within 3 days
   */
  getExpiryInfo: (date, soonDays = 3) => {
    const end = FormatterHelper.parseLocalDate(date);
    if (!end) {
      return { daysLeft: null, label: null, tone: "ok" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    const daysLeft = Math.round((endDay - today) / 86400000);

    if (daysLeft < 0) {
      const ago = Math.abs(daysLeft);
      return {
        daysLeft,
        label: ago === 1 ? "Expired yesterday" : `Expired ${ago}d ago`,
        tone: "expired",
      };
    }
    if (daysLeft === 0) {
      return { daysLeft, label: "Expires today", tone: "soon" };
    }
    if (daysLeft === 1) {
      return { daysLeft, label: "Expires tomorrow", tone: "soon" };
    }
    if (daysLeft <= soonDays) {
      return { daysLeft, label: `Expires in ${daysLeft}d`, tone: "soon" };
    }
    return { daysLeft, label: `${daysLeft}d left`, tone: "ok" };
  },
};
