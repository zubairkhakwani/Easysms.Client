import httpClient from "../Base/HttpClient";

export const getReferralCommissionSettings = async () => {
  const response = await httpClient.get("/api/referral-commission/settings");
  return response.data;
};

export const configureReferralCommissionSettings = async (httpRequest) => {
  const response = await httpClient.post(
    "/api/referral-commission/settings",
    httpRequest,
  );
  return response.data;
};

export const getMyReferralSummary = async () => {
  const response = await httpClient.get("/api/users/me/referrals/summary");
  return response.data;
};

export const transferCommissionToBalance = async () => {
  const response = await httpClient.post("/api/users/me/referrals/transfer-to-balance");
  return response.data;
};
