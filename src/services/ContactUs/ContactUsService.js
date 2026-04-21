import httpClient from "../Base/HttpClient";

export const submit = async (httpRequest) => {
  const response = await httpClient.post("/api/contactus", httpRequest);
  return response.data;
};

export const getAllContactUs = async () => {
  const response = await httpClient.get(`/api/contactus`);
  return response.data;
};
