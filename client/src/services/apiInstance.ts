import type { AxiosError } from 'axios';
import axios from 'axios';
import type { StoreType } from '../redux/store';

let store: StoreType | undefined;

export const injectStore = (_store: StoreType): void => {
  store = _store;
};
const apiInstance = axios.create({
  baseURL: '/api',
});

// Перехватчик запроса
apiInstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${store?.getState().auth.accessToken || ''}`;
  }
  return config;
});

// Перехватчик ответа

apiInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config: { sent?: boolean } }) => {
    const prevRequest = err.config; // необходимо чтобы понять что это второй запрос
    if (err.response?.status === 403 && !prevRequest.sent) {
      prevRequest.sent = true;
      const {
        data: { accessToken },
      } = await axios<{ accessToken: string }>('/api/tokens/refresh');
      store?.dispatch({ type: 'auth/setAccessToken', payload: accessToken });
      prevRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiInstance(prevRequest);
    }
    return Promise.reject(err);
  },
);
export default apiInstance;
