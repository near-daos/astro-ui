import { HttpService } from 'services/HttpService';
import { DaoFeedItem } from 'types/dao';
import { appConfig } from 'config';
import { API_MAPPERS } from 'services/sputnik/constants';
import { buildAccountDaosQuery } from 'services/SearchService/builders/daos';

export class OpenSearchApiService {
  private readonly httpService;

  constructor() {
    this.httpService = new HttpService({
      baseURL: process.browser
        ? window.APP_CONFIG.SEARCH_API_URL
        : appConfig.SEARCH_API_URL,
    });
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
}
