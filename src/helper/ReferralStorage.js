const REFERRAL_CODE_KEY = "easysms_referral_code";
const REFERRAL_SOURCE_KEY = "easysms_referral_source";

export function saveReferralFromQuery(searchParams, currentUserReferralCode) {
  const code = searchParams.get("referral")?.trim();
  if (!code) return;

  if (
    currentUserReferralCode &&
    code.toLowerCase() === currentUserReferralCode.toLowerCase()
  ) {
    return;
  }

  localStorage.setItem(REFERRAL_CODE_KEY, code);

  const source = searchParams.get("source")?.trim();
  if (source) {
    localStorage.setItem(REFERRAL_SOURCE_KEY, source);
  }
}

export function getStoredReferral() {
  const referredByCode = localStorage.getItem(REFERRAL_CODE_KEY)?.trim();
  const source = localStorage.getItem(REFERRAL_SOURCE_KEY)?.trim();

  return {
    referredByCode: referredByCode || null,
    source: source || null,
  };
}

export function clearStoredReferral() {
  localStorage.removeItem(REFERRAL_CODE_KEY);
  localStorage.removeItem(REFERRAL_SOURCE_KEY);
}
