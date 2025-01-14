import axiosRequest from "@/config/axios";
import axios from "axios";

export const login = (data: { email: string; password: string }) => {
  return axiosRequest.post("/auth/login", data);
};

export const register = (data: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) => {
  return axiosRequest.post("/auth/register", data);
};

export const getProfile = async () => {
  try {
    const res = await axiosRequest.get("/auth/profile");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const setTokenServer = async (data: object) => {
  try {
    const res = await axios.post("/api/auth", { data });
    return res;
  } catch (error) {
    console.log("errors", error);
  }
};

export const getRefreshToken = (refreshToken: string) => {
  return axiosRequest.post("/auth/refresh-token", { refreshToken });
};

export const deleteTokenServer = async () => {
  try {
    const res = await axios.delete("/api/auth");
    return res;
  } catch (error) {
    console.log("errors", error);
  }
};

export const forgotPassword = (email: string) => {
  return axiosRequest.post("/auth/forgot-password", { email });
};

export const resetPassword = (data: { newPassword: string; token: string }) => {
  return axiosRequest.post("/auth/forgot-password/reset-password", data);
};

const authAPI = {
  login,
  register,
  getProfile,
  resetPassword,
  forgotPassword,
  setTokenServer,
  getRefreshToken,
  deleteTokenServer,
};

export default authAPI;
