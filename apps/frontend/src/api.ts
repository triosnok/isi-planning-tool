import axios from 'axios';

export enum CacheKey {
  USER_PROFILE = 'USER_PROFILE',
}

export const ACCESS_TOKEN_LOCALSTORAGE_KEY = 'accessToken';

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE_KEY);
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
