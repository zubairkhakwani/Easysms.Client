import httpClient from "../Base/HttpClient";

export const getMyRecentNumbers = async () => {
  const response = await httpClient.get("/numbers/recent");
  return response.data;
};

export const cancel = async (activationId) => {
  const response = await httpClient.get(`/numbers/${activationId}/cancel`);
  return response.data;
};

export const complete = async (activationId) => {
  const response = await httpClient.get(`/numbers/${activationId}/complete`);
  return response.data;
};
