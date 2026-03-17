import httpClient from "../Base/HttpClient";

export const getMyOrderHistory = async () => {
  const response = await httpClient.get(`/api/orders/me`);
  return response.data;
};
