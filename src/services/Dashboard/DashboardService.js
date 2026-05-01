import httpClient from "../Base/HttpClient";

export const getDasboardOverview = async (httpRequest) => {
  let startDate = new Date(httpRequest.startDate).toISOString();
  let endDate = new Date(httpRequest.endDate).toISOString();

  const response = await httpClient.get(
    `/api/dashboard/overview?startDate=${startDate}&endDate=${endDate}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  );
  return response.data;
};
