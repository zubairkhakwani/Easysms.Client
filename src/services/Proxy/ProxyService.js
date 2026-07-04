import httpClient from "../Base/HttpClient";

export const getProxyMetaData = async (proxyType) => {
  const response = await httpClient.get(`/api/proxy/metadata/${proxyType}`);
  return response.data;
};

export const calculateProxyOrder = async (httpRequest, signal) => {
  const response = await httpClient.post(
    `/api/proxy/calculate-order`,
    httpRequest,
    { signal },
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

export const getAllActiveProxies = async (httpRequest) => {
  const response = await httpClient.get(
    `/api/orders/proxy/active?pageNumber=${httpRequest.pageNo}&pageSize=${httpRequest.pageSize}&keyword=${httpRequest.filters.keyword}`,
  );
  return response.data;
};

export const getProxyIpReplacements = async (httpRequest) => {
  const response = await httpClient.get(
    `/api/orders/proxy/ip-replacements?pageNumber=${httpRequest.pageNo}&pageSize=${httpRequest.pageSize}&keyword=${httpRequest.filters?.keyword ?? ""}`,
  );
  return response.data;
};

export const getUnresolvedIpReplacementCount = async () => {
  const response = await httpClient.get(
    "/api/proxy/ip-replacements/unresolved-count",
  );
  return response.data;
};

export const toggleProxyIpReplacementResolved = async (id) => {
  const response = await httpClient.post(
    `/api/proxy/ip-replacements/${id}/toggle-resolved`,
  );
  return response.data;
};

export const getIpReplacementAttachment = async (url) => {
  const response = await httpClient.get(url, { responseType: "blob" });
  return response.data;
};

export const changeAuth = async (httpRequest) => {
  const response = await httpClient.post(`/api/proxy/change-auth`, httpRequest);
  return response.data;
};

export const replaceIps = async (formData) => {
  const response = await httpClient.post(`/api/proxy/replace`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const calculateRenewProxyOrder = async (httpRequest) => {
  const response = await httpClient.post(
    `/api/proxy/calculate-renew-order`,
    httpRequest,
  );
  return response.data;
};

export const renewProxyOrder = async (httpRequest) => {
  const response = await httpClient.post(`/api/proxy/renew`, httpRequest);
  return response.data;
};
