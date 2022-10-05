import { HttpService } from 'services/HttpService';
import {
  OpenSearchResponse,
  SearchResponseIndex,
} from 'services/SearchService/types';
import { AxiosResponse, CancelToken } from 'axios';
import { DaoFeedItem } from 'types/dao';
import { BaseParams } from 'services/sputnik/types';
import { PaginationResponse } from 'types/api';
import { appConfig } from 'config';
import { API_MAPPERS } from 'services/sputnik/constants';

export class OpenSearchApiService {
  private readonly httpService;

  constructor() {
    this.httpService = new HttpService({
      baseURL: process.browser
        ? window.APP_CONFIG.SEARCH_API_URL
        : appConfig.SEARCH_API_URL,
    });
  }

  private async fetchResultsByIndex(
    query: string,
    index: SearchResponseIndex,
    size: number | undefined,
    field: string | undefined,
    cancelToken: CancelToken | undefined,
    from = 0
  ): Promise<AxiosResponse<OpenSearchResponse | null>> {
    return this.httpService.post<
      unknown,
      AxiosResponse<OpenSearchResponse | null>
    >(
      `/${index}/_search`,
      {
        query: {
          simple_query_string: {
            query,
            fields: field ? [field] : [],
          },
        },
        size,
        from,
      },
      {
        cancelToken,
      }
    );
  }

  async getAccountDaos(account: string): Promise<DaoFeedItem[]> {
    const { data } = await this.httpService.post<
      unknown,
      { data: { data: DaoFeedItem[]; total: number } }
    >(
      `/dao/_search`,
      {
        query: {
          bool: {
            must: [
              {
                simple_query_string: {
                  query: account,
                  fields: ['accounts'],
                },
              },
            ],
          },
        },
      },
      {
        responseMapper: {
          name: API_MAPPERS.MAP_OPEN_SEARCH_RESPONSE_TO_DAOS,
        },
      }
    );

    return data.data;
  }

  async getDaoList({
    offset = 0,
    limit = 20,
    sort = 'createdAt:DESC',
    filter,
  }: BaseParams): Promise<PaginationResponse<DaoFeedItem[]> | null> {
    try {
      const { data } = await this.httpService.post<
        unknown,
        { data: { data: DaoFeedItem[]; total: number } }
      >(
        `/dao/_search?sort=${sort}&size=${limit}&from=${offset}`,
        {
          query: {
            bool: {
              must: {
                simple_query_string: {
                  query: filter,
                  fields: ['status'],
                },
              },
            },
          },
        },
        {
          responseMapper: {
            name: API_MAPPERS.MAP_OPEN_SEARCH_RESPONSE_TO_DAOS,
          },
        }
      );

      return {
        total: data.total,
        data: data.data,
        count: data.data.length,
        page: 0,
        pageCount: 0,
      };
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
