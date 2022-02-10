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
        case API_MAPPERS.MAP_DAO_DTO_TO_DAO:
          response.data = mapDaoDTOtoDao(response.data);
          break;
        case API_MAPPERS.MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEEDS:
          response.data = {
            ...response.data,
            data: mapDaoFeedItemResponseToDaoFeedItemList(response.data.data),
          };
          break;
        case API_MAPPERS.MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEED:
          response.data = mapDaoFeedItemResponseToDaoFeedItemList(
            response.data
          );
          break;
        case API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS:
          response.data = response.data.map(mapProposalDTOToProposal);
          break;
        case API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSAL:
          response.data = mapProposalDTOToProposal(response.data);
          break;
        case API_MAPPERS.MAP_SEARCH_RESULTS_DTO_TO_DATA_OBJECT:
          response.data = mapSearchResultsDTOToDataObject(
            responseConfig.params.query,
            {
              daos: response.data?.daos?.data,
              proposals: response.data?.proposals?.data,
              members: [],
            }
          );
          break;
        case API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM:
          response.data = {
            ...response.data,
            data: response.data.data.map(
              mapProposalFeedItemResponseToProposalFeedItem
            ),
          };
          break;
        case API_MAPPERS.MAP_SUBSCRIPTIONS_DTOS_TO_DAO_SUBSCRIPTIONS:
          response.data = mapSubscriptionsDTOsToDaoSubscriptions(response.data);
          break;
        case API_MAPPERS.MAP_TOKENS_DTO_TO_TOKENS:
          response.data = mapTokensDTOToTokens(response.data.data);
          break;
        case API_MAPPERS.MAP_TOKENS_DTO_TO_TOKEN:
          response.data = mapTokensDTOToTokens(response.data);
          break;
        case API_MAPPERS.MAP_NFT_TOKEN_RESPONSE_TO_NFT_TOKEN:
          response.data = mapNftTokenResponseToNftToken(response.data.data);
          break;
        case API_MAPPERS.MAP_RECEIPTS_BY_TOKEN_RESPONSE:
          response.data = mapReceiptsByTokenResponse(
            responseConfig?.responseMapper?.params?.accountId || '',
            responseConfig?.responseMapper?.params?.tokenId || '',
            response.data
          );
          break;
        case API_MAPPERS.MAP_RECEIPTS_RESPONSE:
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
