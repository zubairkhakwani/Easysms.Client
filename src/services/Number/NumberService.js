import httpClient from "../Base/HttpClient";

export const getMyNumbers = async (active = false) => {
  const response = await httpClient.get(`/api/numbers?active=${active}`);
  return response.data;
};

export const addPhysical = async (numbers) => {
  const response = await httpClient.post(`/api/numbers/add-physical`, numbers);

  return response.data;
};

export const cancelNumber = async (activationId) => {
  const response = await httpClient.get(`/api/numbers/${activationId}/cancel`);
  return response.data;
};

export const completeNumber = async (activationId) => {
  const response = await httpClient.get(
    `/api/numbers/${activationId}/complete`,
  );
  return response.data;
};
