import httpClient from "../Base/HttpClient";

export const getProxyMetaData = async () => {
  const response = await httpClient.get(`/api/proxy/metadata`);
  return response.data;
};

export const calculateProxyOrder = async (httpRequest) => {
  const response = await httpClient.post(
    `/api/proxy/calculate-order`,
    httpRequest,
  );
  return response.data;
};

export const requestProxy = async (httpRequest) => {
  const response = await httpClient.post(`/api/proxy/request`, httpRequest);
  return response.data;
};

export const getMyActiveProxies = async (httpRequest) => {
  const response = await httpClient.get(
    `/api/orders/proxy/active/me?pageNumber=${httpRequest.pageNo}&pageSize=${httpRequest.pageSize}&keyword=${httpRequest.filters.keyword}`,
  );
  return response.data;
};
