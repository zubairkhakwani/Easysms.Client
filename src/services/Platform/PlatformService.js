import httpClient from "../Base/HttpClient";

export const getAllPlatforms = async ({ pageNo, pageSize }) => {
  const queryParams = new URLSearchParams({
    pageNumber: pageNo,
    pageSize: pageSize,
  }).toString();

  const response = await httpClient.get(`/api/platforms?${queryParams}`);
  return response.data;
};
export const addNewPlatform = async (httpRequest) => {
  const response = await httpClient.post(`/api/platforms`, httpRequest);
  return response.data;
};
