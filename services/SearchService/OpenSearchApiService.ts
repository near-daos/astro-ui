import { HttpService } from 'services/HttpService';
import {
  OpenSearchResponse,
  SearchResponseIndex,
} from 'services/SearchService/types';
import { AxiosResponse, CancelToken } from 'axios';
import { DaoFeedItem } from 'types/dao';
import { BaseParams, ProposalsListParams } from 'services/sputnik/types';
import { PaginationResponse } from 'types/api';
import { appConfig } from 'config';
import { API_MAPPERS } from 'services/sputnik/constants';
import { BountyContext } from 'types/bounties';
import { buildBountiesQuery } from 'services/SearchService/builders/bounties';
import { ProposalFeedItem } from 'types/proposal';
import { buildProposalsQuery } from 'services/SearchService/builders/proposals';
import {
  buildAccountDaosQuery,
  buildDaosListQuery,
} from 'services/SearchService/builders/daos';

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
        query: buildAccountDaosQuery(account),
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
    sort = 'createTimestamp,DESC',
    filter,
  }: BaseParams): Promise<PaginationResponse<DaoFeedItem[]> | null> {
    try {
      const sortOptions = sort?.split(',');

      const { data } = await this.httpService.post<
        unknown,
        { data: { data: DaoFeedItem[]; total: number } }
      >(
        `/dao/_search?size=${limit}&from=${offset}`,
        {
          query: buildDaosListQuery(filter),
          sort: [
            {
              [sortOptions[0]]: {
                order: sortOptions[1].toLowerCase(),
              },
            },
          ],
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

  async getBountiesContext(params: {
    account?: string;
    bountyFilter: string | null;
    bountySort: string | null;
    bountyPhase: string | null;
    limit?: number;
    offset?: number;
  }): Promise<PaginationResponse<BountyContext[]> | null> {
    try {
      const { data } = await this.httpService.post<
        unknown,
        { data: { data: BountyContext[]; total: number } }
      >(
        `/bounty/_search?size=${params.limit}&from=${params.offset}`,
        {
          query: buildBountiesQuery(params),
        },
        {
          responseMapper: {
            name: API_MAPPERS.MAP_OPEN_SEARCH_RESPONSE_TO_BOUNTIES,
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

  public async getProposalsList(
    query: ProposalsListParams,
    accountId?: string
  ): Promise<PaginationResponse<ProposalFeedItem[]> | null> {
    const { limit, offset = 0, sort = 'createTimestamp,DESC' } = query;

    const sortOptions = sort.split(',');

    try {
      const { data } = await this.httpService.post<
        unknown,
        { data: { data: ProposalFeedItem[]; total: number } }
      >(
        `/proposal/_search?size=${limit}&from=${offset}`,
        {
          query: buildProposalsQuery(query, accountId),
          sort: [
            {
              [sortOptions[0]]: {
                order: sortOptions[1].toLowerCase(),
              },
            },
          ],
        },
        {
          responseMapper: {
            name: API_MAPPERS.MAP_OPEN_SEARCH_RESPONSE_TO_PROPOSALS,
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
