/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { appConfig } from 'config';

export class HttpService {
  private readonly client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: appConfig.apiUrl,
      ...config
    });
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.get<T, R>(url, config);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  post<T, R>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.client.post<T, R>(url, data, config);
  }
}

export const httpService = new HttpService();
