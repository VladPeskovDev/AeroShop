import type { AxiosInstance, AxiosResponse } from 'axios';
import apiInstance from './apiInstance';
import type { UserFromBackendType, UserSignInType, UserSignUpType } from '../types/userTypes';

class AuthService {
  constructor(private readonly api: AxiosInstance) {}

  async authSignUp(userData: UserSignUpType): Promise<UserFromBackendType> {
    const { data } = await this.api.post<UserFromBackendType>('/auth/signup', userData);
    return data;
  }

  async authSignIn(userData: UserSignInType): Promise<UserFromBackendType> {
    const { data } = await this.api.post<UserFromBackendType>('/auth/signin', userData);
    return data;
  }

  async checkUser(): Promise<UserFromBackendType> {
    const { data } = await this.api<UserFromBackendType>('/tokens/refresh');
    setTimeout(() => {})
    return data;
  }

  async logout(): Promise<AxiosResponse> {
    return this.api('/auth/logout');
  }
}

export default new AuthService(apiInstance);
