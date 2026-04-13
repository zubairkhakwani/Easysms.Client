import httpClient from "../Base/HttpClient";

export const getAllCategories = async ({ pageNo, pageSize, platformId }) => {
  const queryParams = new URLSearchParams({
    platformId,
    pageNumber: pageNo,
    pageSize: pageSize,
  }).toString();

  const response = await httpClient.get(`/api/categories?${queryParams}`);
  return response.data;
};
export const addNewCategory = async (httpRequest) => {
  const response = await httpClient.post(`/api/categories`, httpRequest);
  return response.data;
};
