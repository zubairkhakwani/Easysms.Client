import httpClient from "../Base/HttpClient";

export const getAllAdminCategories = async ({
  pageNo,
  pageSize,
  platformId,
}) => {
  const queryParams = new URLSearchParams({
    platformId,
    pageNumber: pageNo,
    pageSize: pageSize,
  }).toString();

  const response = await httpClient.get(`/api/categories/admin?${queryParams}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await httpClient.get(`/api/categories`);
  return response.data;
};

export const addNewCategory = async (httpRequest) => {
  const response = await httpClient.post(`/api/categories`, httpRequest);
  return response.data;
};
