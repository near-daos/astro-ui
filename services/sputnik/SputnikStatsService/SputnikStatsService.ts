import { HttpService } from 'services/HttpService';
import {
  CommonOverTime,
  DaoTokensStat,
  DaoTvl,
  FundsOverTime,
} from 'types/stats';
import { appConfig } from 'config';

const StatsHttpService = new HttpService({
  baseURL: appConfig.statsApiUrl,
});

class SputnikStatsServiceClass {
  private readonly httpService: HttpService = StatsHttpService;

  public async getDaoUsersInteractionsOverTime(
    daoId: string
  ): Promise<CommonOverTime> {
    const { data } = await this.httpService.get<CommonOverTime>(
      `/astro/users/${daoId}/interactions`
    );

    return data;
  }

  public async getDaoFundsOverTime(daoId: string): Promise<FundsOverTime> {
    const { data } = await this.httpService.get<FundsOverTime>(
      `/astro/flow/${daoId}/funds`
    );

    return data;
  }

  public async getDaoTvl(daoId: string): Promise<DaoTvl> {
    const { data } = await this.httpService.get<DaoTvl>(`/astro/tvl/${daoId}`);

    return data;
  }

  public async getDaoTokensStat(daoId: string): Promise<DaoTokensStat> {
    const { data } = await this.httpService.get<DaoTokensStat>(
      `/astro/tokens/${daoId}`
    );

    return data;
  }

  public async getBountiesOverTime(daoId: string): Promise<CommonOverTime> {
    const { data } = await this.httpService.get<CommonOverTime>(
      `/astro/tvl/${daoId}/bounties/number`
    );

    return data;
  }

  public async getNFTsOverTime(daoId: string): Promise<CommonOverTime> {
    const { data } = await this.httpService.get<CommonOverTime>(
      `/astro/tokens/${daoId}/nfts`
    );

    return data;
  }
}

export const SputnikStatsService = new SputnikStatsServiceClass();
