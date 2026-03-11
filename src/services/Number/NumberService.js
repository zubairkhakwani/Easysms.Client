import httpClient from "../Base/HttpClient";

export const getMyNumbers = async (active = false) => {
  const response = await httpClient.get(`/api/numbers?active=${active}`);
  return response.data;
};

export const cancel = async (activationId) => {
  const response = await httpClient.get(`/api/numbers/${activationId}/cancel`);
  return response.data;
};

export const complete = async (activationId) => {
  const response = await httpClient.get(
    `/api/numbers/${activationId}/complete`,
  );
  return response.data;
};
