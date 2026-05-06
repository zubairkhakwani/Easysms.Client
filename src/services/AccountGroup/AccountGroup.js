import httpClient from "../Base/HttpClient";

export const getAllAccountGroups = async ({ pageNo, pageSize }) => {
  const queryParams = new URLSearchParams({
    pageNumber: pageNo,
    pageSize: pageSize,
  }).toString();

  const response = await httpClient.get(`/api/accountgroups?${queryParams}`);
  return response.data;
};
export const upsertAccountGroup = async (httpRequest, accountGroupId) => {
  if (accountGroupId > 0) {
    const response = await httpClient.put(
      `/api/accountgroups/${accountGroupId}/edit`,
      httpRequest,
    );
    return response.data;
  }

  const response = await httpClient.post(`/api/accountgroups`, httpRequest);
  return response.data;
};

export const toggleAccountGroup = async (id) => {
  const response = await httpClient.put(`/api/accountgroups/${id}/toggle`);
  return response.data;
};
