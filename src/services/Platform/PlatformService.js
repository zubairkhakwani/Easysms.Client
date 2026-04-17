import httpClient from "../Base/HttpClient";

export const getAllPlatforms = async ({ pageNo, pageSize }) => {
  const queryParams = new URLSearchParams({
    pageNumber: pageNo,
    pageSize: pageSize,
  }).toString();

  const response = await httpClient.get(`/api/platforms?${queryParams}`);
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
