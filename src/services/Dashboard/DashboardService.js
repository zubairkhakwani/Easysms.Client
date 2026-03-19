import httpClient from "../Base/HttpClient";

export const getOverview = async (httpRequest) => {
  let startDate = new Date(httpRequest.startDate).toISOString();
  let endDate = new Date(httpRequest.endDate).toISOString();

  const response = await httpClient.get(
    `/api/dashboard/overview?startDate=${startDate}&endDate=${endDate}&provider=${httpRequest.provider}`,
  );
  return response.data;
};
