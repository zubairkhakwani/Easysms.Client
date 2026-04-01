import httpClient from "../Base/HttpClient";

export const getMyNumbers = async (active = false) => {
  const response = await httpClient.get(`/api/numbers?active=${active}`);
  return response.data;
};

export const addPhysical = async (numbers) => {
  const response = await httpClient.post(`/api/numbers/add-physical`, numbers);

  return response.data;
};

export const cancelNumber = async (id) => {
  const response = await httpClient.get(`/api/numbers/${id}/cancel`);
  return response.data;
};

export const completeNumber = async (id) => {
  const response = await httpClient.get(`/api/numbers/${id}/complete`);
  return response.data;
};

export const getActiveNumbers = async () => {
  const response = await httpClient.get(`/api/numbers/active`);
  return response.data;
};
