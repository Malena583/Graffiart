import apiClient from "../api/axios";

export const loginUser = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await apiClient.post("/auth/register", userData);
  return data;
};

export const requestPasswordReset = async (email) => {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await apiClient.post("/auth/reset-password", payload);
  return data;
};

const authService = {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
};

export default authService;