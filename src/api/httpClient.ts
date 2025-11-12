import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete httpClient.defaults.headers.common.Authorization;
  }
};

export default httpClient;
