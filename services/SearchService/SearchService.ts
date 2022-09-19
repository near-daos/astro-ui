import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { SearchParams } from 'services/SearchService/types';
import { SearchResultsData } from 'types/search';
import { API_MAPPERS, API_QUERIES } from 'services/sputnik/constants';

class SearchService {
  private httpService = new HttpService({
    baseURL: process.browser
      ? window.APP_CONFIG.SEARCH_API_URL
      : appConfig.SEARCH_API_URL,
  });

  constructor(httpService?: HttpService) {
    if (httpService) {
      this.httpService = httpService;
    }
  }

  public async search(params: SearchParams): Promise<SearchResultsData | null> {
    try {
      const config = process.browser ? window.APP_CONFIG : appConfig;
      const { data } = await this.httpService.get<SearchResultsData | null>(
        '/_search',
        {
          queryRequest: {
            name: API_QUERIES.OPEN_SEARCH_AUTHORIZATION,
            params: {
              username: config.OPEN_SEARCH_USERNAME,
              password: config.OPEN_SEARCH_PASSWORD,
            },
          },
          responseMapper: {
            name: API_MAPPERS.MAP_OPEN_SEARCH_RESULTS,
          },
          params: {
            q: `*${params.query}*`,
            size: 5000,
            sort: '_index',
          },
          cancelToken: params.cancelToken,
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}

export const searchService = new SearchService();
