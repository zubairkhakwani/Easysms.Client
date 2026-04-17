import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import httpClient from "../Base/HttpClient";

export const addNewAccount = async (httpRequest) => {
  const response = await httpClient.post(`/api/accounts`, httpRequest);
  return response.data;
};

export const getAllAccounts = async ({ platformId, categoryId }) => {
  const queryParams = new URLSearchParams({
    platformId: platformId,
    categoryId: categoryId,
  }).toString();

  const response = await httpClient.get(`/api/accounts?${queryParams}`);
  return response.data;
};

export const buyNewAccount = async (httpRequest) => {
  const response = await httpClient.post(`/api/accounts/buy`, httpRequest);
  return response.data;
};
