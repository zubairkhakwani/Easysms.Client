import httpClient from "../Base/HttpClient";

export const addNewAccount = async (httpRequest) => {
  const response = await httpClient.post(`/api/accounts`, httpRequest);
  return response.data;
};
