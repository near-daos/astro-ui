/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Mappers
import {
  mapDaoDTOtoDao,
  mapDaoFeedItemResponseToDaoFeedItemList,
  mapProposalDTOToProposal,
  mapProposalFeedItemResponseToProposalFeedItem,
  mapReceiptsByTokenResponse,
  mapReceiptsResponse,
  mapSearchResultsDTOToDataObject,
  mapSubscriptionsDTOsToDaoSubscriptions,
  mapTokensDTOToTokens,
} from 'services/sputnik/mappers';
import { mapNftTokenResponseToNftToken } from 'services/sputnik/mappers/nfts';

import { API_MAPPERS, ApiMappers } from 'constants/mappers';
import { appConfig } from 'config';

export interface Mapper {
  name: ApiMappers | string;
  params?: { [key: string]: string };
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  responseMapper?: Mapper;
}

export class HttpService {
  private readonly client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: appConfig.apiUrl,
      ...config,
    });

    this.client.interceptors.response.use(response => {
      const responseConfig: CustomAxiosRequestConfig = response.config;

      if (!responseConfig.responseMapper) {
        return response;
      }

      switch (responseConfig.responseMapper.name) {
        case API_MAPPERS.mapDaoDTOtoDao:
          response.data = mapDaoDTOtoDao(response.data);
          break;
        case API_MAPPERS.mapDaoFeedItemResponseToDaoFeedItemList:
          if (Array.isArray(response.data.data)) {
            response.data = {
              ...response.data,
              data: mapDaoFeedItemResponseToDaoFeedItemList(response.data.data),
            };
            break;
          }

          response.data = mapDaoFeedItemResponseToDaoFeedItemList(
            response.data
          );
          break;
        case API_MAPPERS.mapProposalDTOToProposal:
          if (Array.isArray(response.data)) {
            response.data = response.data.map(mapProposalDTOToProposal);
            break;
          }

          response.data = mapProposalDTOToProposal(response.data);
          break;
        case API_MAPPERS.mapSearchResultsDTOToDataObject:
          response.data = mapSearchResultsDTOToDataObject(
            responseConfig.params.query,
            {
              daos: response.data?.daos?.data,
              proposals: response.data?.proposals?.data,
              members: [],
            }
          );
          break;
        case API_MAPPERS.mapProposalFeedItemResponseToProposalFeedItem:
          response.data = {
            ...response.data,
            data: response.data.data.map(
              mapProposalFeedItemResponseToProposalFeedItem
            ),
          };
          break;
        case API_MAPPERS.mapSubscriptionsDTOsToDaoSubscriptions:
          response.data = mapSubscriptionsDTOsToDaoSubscriptions(response.data);
          break;
        case API_MAPPERS.mapTokensDTOToTokens:
          if (Array.isArray(response.data.data)) {
            response.data = mapTokensDTOToTokens(response.data.data);
            break;
          }

          response.data = mapTokensDTOToTokens(response.data);
          break;
        case API_MAPPERS.mapNftTokenResponseToNftToken:
          response.data = mapNftTokenResponseToNftToken(response.data.data);
          break;
        case API_MAPPERS.mapReceiptsByTokenResponse:
          response.data = mapReceiptsByTokenResponse(
            responseConfig?.responseMapper?.params?.accountId || '',
            responseConfig?.responseMapper?.params?.tokenId || '',
            response.data
          );
          break;
        case API_MAPPERS.mapReceiptsResponse:
          response.data = mapReceiptsResponse(
            responseConfig?.responseMapper?.params?.accountId || '',
            response.data
          );
          break;
        default:
          break;
      }

      return response;
    });
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<R> {
    return this.client.get<T, R>(url, config);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  post<T, R>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.client.post<T, R>(url, data, config);
  }

  patch<T, R>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.patch<T, R>(url, data, config);
  }

  delete<T, R>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.delete<T, R>(url, {
      ...config,
      data,
    });
  }
}

export const httpService = new HttpService();
