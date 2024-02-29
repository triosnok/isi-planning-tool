import axios from 'axios';

export enum CacheKey {
  USER_PROFILE = 'USER_PROFILE',
  PROJECT_LIST = 'PROJECT_LIST',
  PROJECT_DETAILS = 'PROJECT',
  VEHICLE_LIST = 'VEHICLE_LIST',
  VEHICLE_DETAILS = 'VEHICLE',
}

export const ACCESS_TOKEN_LOCALSTORAGE_KEY = 'accessToken';

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE_KEY);
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
