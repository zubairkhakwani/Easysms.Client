import httpClient from "../Base/HttpClient";

export const getAllAdminPlatforms = async ({ pageNo, pageSize }) => {
  const queryParams = new URLSearchParams({
    pageNumber: pageNo,
    pageSize: pageSize,
  }).toString();

  const response = await httpClient.get(`/api/platforms/admin?${queryParams}`);
  return response.data;
};

export const getAllPlatforms = async () => {
  const response = await httpClient.get(`/api/platforms`);
  return response.data;
};

export const upsertPlatform = async (httpRequest) => {
  let id = httpRequest.id;
  let url = "/api/platforms";

  if (id) {
    url += `/${id}/edit`;
  }
  const response = await httpClient.post(url, httpRequest);

  return response.data;
};
