import httpClient from "../Base/HttpClient";

export const getCurrentUser = async () => {
  const response = await httpClient.get(`/api/users/me`);
  return response.data;
};

export const getAll = async (httpRequest) => {
  const response = await httpClient.get(
    `/api/users?pageNumber=${httpRequest?.pageNo ?? 0}&pageSize=${httpRequest?.pageSize ?? 0}`,
  );
  return response.data;
};

export const topUpBalance = async (userId, amount) => {
  const response = await httpClient.post(`/api/users/${userId}`, { amount });
  return response.data;
};

export const getDeposts = async (httpRequest) => {
  const response = await httpClient.post(
    `/api/users/deposits?startDate=${httpRequest.startDate}&endDate=${httpRequest.endDate}&pageNumber=${httpRequest.pageNo}&pageSize=${httpRequest.pageSize}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  );
  return response.data;
};
