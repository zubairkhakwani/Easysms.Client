import httpClient from "../Base/HttpClient";

export const getMyNumberHistory = async (httpRequest) => {
  const response = await httpClient.get(
    `/api/orders/numbers/me?startDate=${httpRequest.filters.startDate}&endDate=${httpRequest.filters.endDate}&provider=${httpRequest.filters.provider}&status=${httpRequest.filters.status}&hasOtp=${httpRequest.filters.hasOtp}&pageNumber=${httpRequest.pageNo}&pageSize=${httpRequest.pageSize}&keyword=${httpRequest.filters.keyword}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  );
  return response.data;
};

export const getMyAccountHistory = async () => {
  const response = await httpClient.get(`/api/orders/accounts/me`);
  return response.data;
};
