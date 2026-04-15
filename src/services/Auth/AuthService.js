import httpClient from "../Base/HttpClient";

export const registerUser = async (data) => {
  const response = await httpClient.post("/api/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await httpClient.post("/api/auth/login", data);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await httpClient.post("/api/auth/forgot-password", email);
  return response.data;
};

export const verifyOtp = async (httpRequest) => {
  const response = await httpClient.post("/api/auth/verify-otp", httpRequest);
  return response.data;
};

export const resendOtp = async (httpRequest) => {
  const response = await httpClient.post("/api/auth/resend-otp", httpRequest);
  return response.data;
};

export const resetPassword = async (httpRequest) => {
  const response = await httpClient.post(
    "/api/auth/reset-password",
    httpRequest,
  );
  return response.data;
};

export const changePassword = async (httpRequest) => {
  const response = await httpClient.post(
    "/api/auth/change-password",
    httpRequest,
  );
  return response.data;
};
