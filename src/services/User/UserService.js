import httpClient from "../Base/HttpClient";

export const getCurrentUser = async () => {
  const response = await httpClient.get(`/api/users/me`);
  return response.data;
};

export const getAll = async (httpRequest) => {
  const params = new URLSearchParams({
    pageNumber: String(httpRequest?.pageNo ?? 0),
    pageSize: String(httpRequest?.pageSize ?? 10),
    keyword: httpRequest?.keyword ?? "",
  });

  if (httpRequest?.hasSource) {
    params.append("hasSource", "true");
  }
  if (httpRequest?.hasReferrer) {
    params.append("hasReferrer", "true");
  }

  const response = await httpClient.get(`/api/users?${params}`);
  return response.data;
};

export const topUpBalance = async (httpRequest) => {
  const response = await httpClient.post(
    `/api/users/${httpRequest.userId}`,
    httpRequest,
  );
  return response.data;
};

export const commissionWithdraw = async (userId, httpRequest) => {
  const response = await httpClient.post(
    `/api/users/${userId}/commission-withdraw`,
    httpRequest,
  );
  return response.data;
};

export const getDeposts = async (httpRequest) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const params = new URLSearchParams({
    startDate: httpRequest.startDate,
    endDate: httpRequest.endDate,
    pageNumber: String(httpRequest.pageNo ?? 0),
    pageSize: String(httpRequest.pageSize ?? 10),
    timezone,
  });

  if (httpRequest.keyword) {
    params.append("keyword", httpRequest.keyword);
  }

  const response = await httpClient.post(`/api/users/deposits?${params}`);
  return response.data;
};

// User wallet ledger — maps to GET /api/users/me/history
export const getMyWalletHistory = async (httpRequest) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const params = new URLSearchParams({
    pageNumber: String(httpRequest.pageNo ?? 0),
    pageSize: String(httpRequest.pageSize ?? 10),
    timezone,
  });

  if (httpRequest.filters?.keyword) {
    params.append("keyword", httpRequest.filters.keyword);
  }
  if (httpRequest.filters?.startDate) {
    params.append("startDate", httpRequest.filters.startDate);
  }
  if (httpRequest.filters?.endDate) {
    params.append("endDate", httpRequest.filters.endDate);
  }
  if (httpRequest.filters?.type) {
    params.append("type", httpRequest.filters.type);
  }

  const response = await httpClient.get(`/api/users/me/history?${params}`);
  return response.data;
};
