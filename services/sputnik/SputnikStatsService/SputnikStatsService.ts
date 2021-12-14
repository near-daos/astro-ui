import { HttpService } from 'services/HttpService';
import { Metric } from 'types/stats';
import { appConfig } from 'config';

const StatsHttpService = new HttpService({
  baseURL: appConfig.statsApiUrl,
});

class SputnikStatsServiceClass {
  private readonly httpService: HttpService = StatsHttpService;

  public async getDaoUsersInteractionsStats(daoId: string): Promise<Metric[]> {
    const { data } = await this.httpService.get<{ metrics: Metric[] }>(
      `/astro/users/${daoId}/interactions`
    );

    return data.metrics;
  }
}

export const SputnikStatsService = new SputnikStatsServiceClass();
