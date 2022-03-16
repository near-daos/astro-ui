import { AxiosResponse } from 'axios';
import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { Config } from 'types/config';
import {
  DaoParams,
  Dao,
  Params,
  HistoryParams,
  Flow,
  Metrics,
  Leaderboard,
  DaoHistoryParams,
  FlowMetrics,
  General,
  Governance,
  Tokens,
  Tvl,
  TvlDao,
  ProposalMetrics,
  DaoIntervalHistoryParams,
  IntervalHistoryParams,
  Users,
} from './types';

class DaoStatsService {
  private httpService = new HttpService({
    baseURL: appConfig.statsApiUrl,
  });

  public init(_appConfig: Config): void {
    this.httpService = new HttpService({
      baseURL: `${_appConfig.STATS_API_URL}/api/v1/`,
    });
  }

  // Dao
  public async getDao(params: DaoParams): Promise<AxiosResponse<Dao>> {
    return this.httpService.get(`${params.contract}/daos/${params.dao}`);
  }

  // Flow
  public async getFlow(params: Params): Promise<AxiosResponse<Flow>> {
    return this.httpService.get(`${params.contract}/flow`);
  }

  async getFlowHistory(
    params: HistoryParams
  ): Promise<AxiosResponse<FlowMetrics>> {
    return this.httpService.get(`${params.contract}/flow/funds`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  public async getFlowLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/flow/funds/leaderboard`);
  }

  public async getFlowTransactionsHistory(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/flow/transactions`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  public async getFlowTransactionsLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/flow/transactions/leaderboard`
    );
  }

  public async getFlowDao(params: DaoParams): Promise<AxiosResponse<Flow>> {
    return this.httpService.get(`${params.contract}/flow/${params.dao}`);
  }

  public async getFlowDaoFunds(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<FlowMetrics>> {
    return this.httpService.get(`${params.contract}/flow/${params.dao}/funds`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  public async getFlowDaoTransactions(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<FlowMetrics>> {
    return this.httpService.get(
      `${params.contract}/flow/${params.dao}/transactions`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  public async getGeneral(params: Params): Promise<AxiosResponse<General>> {
    return this.httpService.get(`${params.contract}/general`);
  }

  public async getGeneralActive(
    params: IntervalHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/general/active`, {
      params: {
        from: params.from,
        to: params.to,
        interval: params.interval,
      },
    });
  }

  public async getGeneralActiveLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/general/active/leaderboard`
    );
  }

  async getGeneralGroups(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/general/groups`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getGeneralGroupsLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/general/groups/leaderboard`
    );
  }

  async getGeneralAverageGroups(
    params: Params
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/general/average-groups`);
  }

  async getGeneralDao(params: DaoParams): Promise<AxiosResponse<General>> {
    return this.httpService.get(`${params.contract}/general/${params.dao}`);
  }

  async getGeneralDaos(params: HistoryParams): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/general/daos`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getGeneralDaoGroups(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/general/${params.dao}/groups`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getGeneralDaoActivity(
    params: DaoIntervalHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/general/${params.dao}/activity`,
      {
        params: {
          from: params.from,
          to: params.to,
          interval: params.interval,
        },
      }
    );
  }

  async getGovernance(params: Params): Promise<AxiosResponse<Governance>> {
    return this.httpService.get(`${params.contract}/governance`);
  }

  async getGovernanceProposals(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/governance/proposals`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getGovernanceProposalsLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/proposals/leaderboard`
    );
  }

  async getGovernanceProposalsTypes(
    params: HistoryParams
  ): Promise<AxiosResponse<ProposalMetrics>> {
    return this.httpService.get(
      `${params.contract}/governance/proposals-types`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getGovernanceProposalsTypesLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/proposals-types/leaderboard`
    );
  }

  async getGovernanceVoteRate(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/governance/vote-rate`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getGovernanceVoteRateLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/vote-rate/leaderboard`
    );
  }

  async getGovernanceDao(
    params: DaoParams
  ): Promise<AxiosResponse<Governance>> {
    return this.httpService.get(`${params.contract}/governance/${params.dao}`);
  }

  async getGovernanceDaoProposals(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/governance/${params.dao}/proposals`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getGovernanceDaoProposalsTypes(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<ProposalMetrics>> {
    return this.httpService.get(
      `${params.contract}/governance/${params.dao}/proposals-types`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getGovernanceDaoVoteRate(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/governance/${params.dao}/vote-rate`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getTokens(params: Params): Promise<AxiosResponse<Tokens>> {
    return this.httpService.get(`${params.contract}/tokens`);
  }

  async getTokensFts(params: HistoryParams): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/tokens/fts`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getTokensFtsLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/tokens/fts/leaderboard`);
  }

  async getTokensFtsVl(params: HistoryParams): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/tokens/fts-vl`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getTokensFtsVlLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/tokens/fts-vl/leaderboard`);
  }

  async getTokensNfts(params: HistoryParams): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/tokens/nfts`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getTokensNftsLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/tokens/nfts/leaderboard`);
  }

  async getTokensDao(params: DaoParams): Promise<AxiosResponse<Tokens>> {
    return this.httpService.get(`${params.contract}/tokens/${params.dao}`);
  }

  async getTokensDaoFts(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/tokens/${params.dao}/fts`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getTokensDaoFtsVl(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/tokens/${params.dao}/fts-vl`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getTokensDaoNfts(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/tokens/${params.dao}/nfts`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getTvl(params: Params): Promise<AxiosResponse<Tvl>> {
    return this.httpService.get(`${params.contract}/tvl`);
  }

  async getTvlHistory(params: HistoryParams): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/tvl/tvl`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getTvlLeaderboard(params: Params): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/tvl/tvl/leaderboard`);
  }

  async getTvlBountiesAndGrantsVl(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/tvl/bounties-and-grants-vl`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getTvlBountiesAndGrantsVlLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/tvl/bounties-and-grants-vl/leaderboard`
    );
  }

  async getTvlDao(params: DaoParams): Promise<AxiosResponse<TvlDao>> {
    return this.httpService.get(`${params.contract}/tvl/${params.dao}`);
  }

  async getTvlDaoBountiesNumber(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/tvl/${params.dao}/bounties/number`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getTvlDaoBountiesVl(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/tvl/${params.dao}/bounties/vl`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getTvlDaoTvl(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/tvl/${params.dao}/tvl`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getUsers(params: Params): Promise<AxiosResponse<Users>> {
    return this.httpService.get(`${params.contract}/users`);
  }

  async getUsersActiveUsers(
    params: IntervalHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/users/active-users`, {
      params: {
        from: params.from,
        to: params.to,
        interval: params.interval,
      },
    });
  }

  async getUsersActiveUsersLeaderboard(
    params: IntervalHistoryParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/users/active-users/leaderboard`,
      {
        params: {
          from: params.from,
          to: params.to,
          interval: params.interval,
        },
      }
    );
  }

  async getUsersUsers(params: HistoryParams): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/users/users`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getUsersLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/users/users/leaderboard`);
  }

  async getUsersMembers(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/users/members`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getUsersMembersLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/users/members/leaderboard`);
  }

  async getUsersAverageUsers(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/users/average-users`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getUsersInteractions(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/users/interactions`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getUsersInteractionsLeaderboard(
    params: Params
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/users/interactions/leaderboard`
    );
  }

  async getUsersAverageInteractions(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/users/average-interactions`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getUsersDao(params: DaoParams): Promise<AxiosResponse<Users>> {
    return this.httpService.get(`${params.contract}/users/${params.dao}`);
  }

  async getUsersDaoActiveUsers(
    params: DaoIntervalHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/users/${params.dao}/active-users`,
      {
        params: {
          from: params.from,
          to: params.to,
          interval: params.interval,
        },
      }
    );
  }

  async getUsersDaoUsers(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/users/${params.dao}/users`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getUsersDaoMembers(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/users/${params.dao}/members`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getUsersDaoInteractions(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/users/${params.dao}/interactions`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }
}

export const daoStatsService = new DaoStatsService();
