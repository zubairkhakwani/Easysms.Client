import httpClient from "../Base/HttpClient";

export const submit = async (httpRequest) => {
  const response = await httpClient.post("/api/contactus", httpRequest);
  return response.data;
};

export const getAllContactUs = async () => {
  const response = await httpClient.get(`/api/contactus`);
  return response.data;
};

export const toggleContactUsMessage = async (id) => {
  const response = await httpClient.put(`/api/contactus/${id}/toggle-read`);
  return response.data;
};

export const contactUsReply = async (id, httpRequest) => {
  console.log(id);
  console.log(httpRequest);
  const response = await httpClient.put(
    `/api/contactus/${id}/reply`,
    httpRequest,
  );
  return response.data;
};
