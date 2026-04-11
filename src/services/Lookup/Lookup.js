import httpClient from "../Base/HttpClient";

export const getAllLookups = async () => {
  const response = await httpClient.get("/api/lookups");
  return response.data;
};
