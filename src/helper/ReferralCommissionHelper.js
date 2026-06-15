/**
 * Min uses the lowest positive rate (zeros excluded) unless every rate is zero.
 * Max uses the highest rate across all services.
 */
export function getReferralCommissionRateBounds(
  tempNumber,
  mail,
  account,
  proxy,
) {
  const rates = [tempNumber, mail, account, proxy].map(Number);
  const positiveRates = rates.filter((r) => r > 0);

  if (positiveRates.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...positiveRates),
    max: Math.max(...rates),
  };
}
