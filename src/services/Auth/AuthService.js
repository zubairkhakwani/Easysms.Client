import httpClient from "../Base/HttpClient";
import { jwtDecode } from "jwt-decode";

import TokenService from "../Token/TokenService";

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

export const isAuthenticatedUser = () => {
  return !!TokenService.getToken();
};

export const isAuthorizedUser = () => {
  const token = TokenService.getToken();

  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === "Easyotps_Admin_99" || decoded.role === "Agent";
  } catch {
    return false;
  }
};

export const getRolePermissions = () => {
  try {
    const token = TokenService.getToken();

    if (!token) return [];

    const decoded = jwtDecode(token);
    return decoded.permissions || [];
  } catch (error) {
    console.error("Invalid token", error);
    return [];
  }
};
