import httpClient from "../Base/HttpClient";

export const getMyNumbers = async (recent = false) => {
  const response = await httpClient.get(`/numbers?recent=${recent}`);
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
