import axios, { AxiosError, AxiosResponse } from "axios";
import QueryString from "qs";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { getCookie } from "@/utils/cookies";
import { useAppStore } from "@/store/useAppStore";
import { getRefreshToken, setTokenServer } from "@/apis/auth";

type IRequestCb = (token: string) => void;

let isRefreshing = false;
const refreshSubscribers: IRequestCb[] = [];

const subscribeTokenRefresh = (cb: IRequestCb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
};

const axiosRequest = axios.create({
  baseURL: "http://localhost:5000/api",
  paramsSerializer: {
    serialize: (params) => {
      return QueryString.stringify(params, {
        arrayFormat: "indices",
        allowDots: true,
      });
    },
  },
});

// Add a request interceptor
axiosRequest.interceptors.request.use(
  (config) => {
    const token = getCookie(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },

  async function (error) {
    const { config } = error;
    const originalRequest = config;
    const oldRefreshToken = getCookie(REFRESH_TOKEN);

    if (error.response?.status === 401) {
      if (!oldRefreshToken) {
        useAppStore.getState().clearProfile();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Get Refresh token
          const { data } = await getRefreshToken(oldRefreshToken);
          setTokenServer(data);

          if (originalRequest.headers) {
            originalRequest.headers.authorization = `Bearer ${data.accessToken}`;
            onRefreshed(data.accessToken);
            return axios(originalRequest);
          }
        } catch (error) {
          useAppStore.getState().clearProfile();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // Call back previously denied APIs
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.authorization = `Bearer ${newToken}`;
          }
          resolve(axios(originalRequest));
        });
      });
    }

    if (axios.isAxiosError(error)) {
      if (error.code === AxiosError.ERR_NETWORK) {
        return Promise.reject("ERR_NETWORK_MSG");
      }
    }

    return Promise.reject(error.response.data?.message as string);
  }
);

export default axiosRequest;
