import { HttpService } from 'services/HttpService';

import { appConfig } from 'config';
import { API_QUERIES } from 'services/sputnik/constants';
import { Authorization } from 'types/auth';

class BountyApiService {
  private readonly httpService;

  constructor() {
    this.httpService = new HttpService({
      baseURL: process.browser
        ? window.APP_CONFIG.API_GATEWAY_API_URL
        : appConfig.API_GATEWAY_API_URL,
    });
  }

  async updateTags(
    params: {
      daoId: string;
      bountyId: string;
      tags: string[];
    } & Authorization
  ): Promise<unknown> {
    const resp = await this.httpService.put<
      unknown,
      { message?: string; error?: string }
    >(`/bounty/tag`, params, {
      queryRequest: {
        name: API_QUERIES.UPDATE_BOUNTY_TAGS,
      },
    });

    return resp;
  }
}

export const bountyApiService = new BountyApiService();
