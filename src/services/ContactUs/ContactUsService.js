import httpClient from "../Base/HttpClient";

export const submit = async (httpRequest) => {
  const response = await httpClient.post("/api/contactus", httpRequest);
  return response.data;
};

export const getAllContactUs = async (httpRequest) => {
  const params = new URLSearchParams({
    pageNumber: String(httpRequest?.pageNo ?? 0),
    pageSize: String(httpRequest?.pageSize ?? 10),
  });

  const response = await httpClient.get(`/api/contactus?${params}`);
  return response.data;
};

export const getUnreadContactUsCount = async () => {
  const response = await httpClient.get("/api/contactus/unread-count");
  return response.data;
};

export const toggleContactUsMessage = async (id) => {
  const response = await httpClient.post(`/api/contactus/${id}/toggle-read`);
  return response.data;
};

export const contactUsReply = async (id, httpRequest) => {
  const response = await httpClient.post(
    `/api/contactus/${id}/reply`,
    httpRequest,
  );
  return response.data;
};
