import httpClient from "../Base/HttpClient";

export const getSystemIntegrity = async () => {
  const response = await httpClient.get("/api/dashboard/integrity");
  return response.data;
};
