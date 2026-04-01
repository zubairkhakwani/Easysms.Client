import httpClient from "../Base/HttpClient";

export const getCurrentUser = async () => {
  const response = await httpClient.get(`/api/users/me`);
  return response.data;
};

export const getAll = async () => {
  const response = await httpClient.get(`/api/users`);
  return response.data;
};

export const topUpBalance = async (userId, amount) => {
  const response = await httpClient.post(`/api/users/${userId}`, { amount });
  return response.data;
};

export const getDeposts = async (httpRequest) => {
  const response = await httpClient.post(
    `/api/users/deposits?startDate=${httpRequest.startDate}&endDate=${httpRequest.endDate}`,
  );
  return response.data;
};
