import httpClient from "../Base/HttpClient";

export const getAllAccountGroups = async ({ pageNo, pageSize }) => {
  const queryParams = new URLSearchParams({
    pageNumber: pageNo,
    pageSize: pageSize,
  }).toString();

  const response = await httpClient.get(`/api/accountgroups?${queryParams}`);
  return response.data;
};
export const addNewAccountGroup = async (httpRequest) => {
  const response = await httpClient.post(`/api/accountgroups`, httpRequest);
  return response.data;
};
