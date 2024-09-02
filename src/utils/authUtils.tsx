import axios, { AxiosResponse } from "axios";
import { BACKEND_URI } from "@/api";

interface RefreshTokenResponse {
  newAccessToken: string;
  newRefreshToken: string;
}

const refreshTokenAndRetry = async (
  method: string,
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<AxiosResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login";
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.get<RefreshTokenResponse>(
      `${BACKEND_URI}/auth/refresh/token`,
      {
        headers: { refreshToken },
      }
    );

    const { newAccessToken, newRefreshToken } = response.data;

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return axios({
      method,
      url: `${BACKEND_URI}${url}`,
      data: body,
      headers: { accessToken: newAccessToken },
    });
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login";
    throw error;
  }
};

const handleRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.log("No access token found. Attempting to refresh...");
    return refreshTokenAndRetry(method, url, body);
  }

  try {
    const response = await axios({
      method,
      url: `${BACKEND_URI}${url}`,
      data: body,
      headers: { accessToken },
    });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.data?.error === "Unauthorized - Invalid accessToken") {
      console.log("Invalid access token. Attempting to refresh...");
      return refreshTokenAndRetry(method, url, body);
    }
    throw error;
  }
};

const handlePublicRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<AxiosResponse> => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await axios({
      method,
      url: `${BACKEND_URI}${url}`,
      data: body,
    });
  } catch (error) {
    throw error;
  }
};

// Authenticated API calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = <T = any,>(url: string): Promise<T> =>
  handleRequest("get", url).then((response) => response.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = <T = any,>(url: string, body?: any): Promise<T> =>
  handleRequest("post", url, body).then((response) => response.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const put = <T = any,>(url: string, body?: any): Promise<T> =>
  handleRequest("put", url, body).then((response) => response.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const del = <T = any,>(url: string): Promise<T> =>
  handleRequest("delete", url).then((response) => response.data);

// Public API calls (no authentication required)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPublic = <T = any,>(url: string): Promise<T> =>
  handlePublicRequest("get", url).then((response) => response.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postPublic = <T = any,>(url: string, body?: any): Promise<T> =>
  handlePublicRequest("post", url, body).then((response) => response.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const putPublic = <T = any,>(url: string, body?: any): Promise<T> =>
  handlePublicRequest("put", url, body).then((response) => response.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const delPublic = <T = any,>(url: string): Promise<T> =>
  handlePublicRequest("delete", url).then((response) => response.data);
