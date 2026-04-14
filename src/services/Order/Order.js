import httpClient from "../Base/HttpClient";

export const getMyNumberHistory = async () => {
  const response = await httpClient.get(`/api/orders/numbers/me`);
  return response.data;
};

export const getMyAccountHistory = async () => {
  const response = await httpClient.get(`/api/orders/accounts/me`);
  return response.data;
};
