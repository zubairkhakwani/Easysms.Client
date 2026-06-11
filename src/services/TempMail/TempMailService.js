import httpClient from "../Base/HttpClient";

export const getMyTempMails = async (active = false) => {
  const response = await httpClient.get(`/api/mails/me?active=${active}`);
  return response.data;
};

export const cancelTempMail = async (id) => {
  const response = await httpClient.get(`/api/mails/${id}/cancel`);
  return response.data;
};

export const completeTempMail = async (id) => {
  const response = await httpClient.get(`/api/mails/${id}/complete`);
  return response.data;
};

export const reorderTempMail = async (id) => {
  const response = await httpClient.post(`/api/mails/${id}/reorder`);
  return response.data;
};
