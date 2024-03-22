import axios from 'axios';

export enum CacheKey {
  USER_PROFILE = 'USER_PROFILE',
  PROJECT_LIST = 'PROJECT_LIST',
  PROJECT_DETAILS = 'PROJECT',
  PROJECT_PLAN_LIST = 'PROJECT_PLAN_LIST',
  PROJECT_PLAN_DETAILS = 'PROJECT_PLAN_DETAILS',
  VEHICLE_LIST = 'VEHICLE_LIST',
  VEHICLE_DETAILS = 'VEHICLE',
  TRIP_LIST = 'TRIP_LIST',
  TRIP_DETAILS = 'TRIP',
  PROJECT_RAILINGS = 'PROJECT_RAILINGS',
}

export const ACCESS_TOKEN_LOCALSTORAGE_KEY = 'accessToken';

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE_KEY);
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
