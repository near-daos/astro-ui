import { AxiosResponse } from 'axios';
import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
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
  LimitParams,
} from './types';
import { LIMIT, OFFSET } from './constants';

export class DaoStatsService {
  private httpService = new HttpService({
    baseURL: `${
      process.browser
        ? window.APP_CONFIG.STATS_API_URL
        : appConfig.STATS_API_URL
    }/api/v1/`,
  });

  constructor(httpService: HttpService) {
    this.httpService = httpService;
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/flow/funds/leaderboard`, {
      params: {
        offset: params.offset || OFFSET,
        limit: params.limit || LIMIT,
      },
    });
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/flow/transactions/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/general/active/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/general/groups/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/proposals/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/proposals-types/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/vote-rate/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
    );
  }

  async getGovernanceActiveProposals(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/governance/active-proposals`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getGovernanceActiveProposalsLeaderboard(
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/active-proposals/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
    );
  }

  async getGovernanceActiveVotes(
    params: HistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(`${params.contract}/governance/active-votes`, {
      params: {
        from: params.from,
        to: params.to,
      },
    });
  }

  async getGovernanceActiveVotesLeaderboard(
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/governance/active-votes/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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

  async getGovernanceDaoActiveProposals(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/governance/${params.dao}/active-proposals`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      }
    );
  }

  async getGovernanceDaoActiveVotes(
    params: DaoHistoryParams
  ): Promise<AxiosResponse<Metrics>> {
    return this.httpService.get(
      `${params.contract}/governance/${params.dao}/active-votes`,
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/tokens/fts/leaderboard`, {
      params: {
        offset: params.offset || OFFSET,
        limit: params.limit || LIMIT,
      },
    });
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/tokens/fts-vl/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
    );
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/tokens/nfts/leaderboard`, {
      params: {
        offset: params.offset || OFFSET,
        limit: params.limit || LIMIT,
      },
    });
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

  async getTvlLeaderboard(
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/tvl/tvl/leaderboard`, {
      params: {
        offset: params.offset || OFFSET,
        limit: params.limit || LIMIT,
      },
    });
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/tvl/bounties-and-grants-vl/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(`${params.contract}/users/users/leaderboard`, {
      params: {
        offset: params.offset || OFFSET,
        limit: params.limit || LIMIT,
      },
    });
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/users/members/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
    );
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
    params: LimitParams
  ): Promise<AxiosResponse<Leaderboard>> {
    return this.httpService.get(
      `${params.contract}/users/interactions/leaderboard`,
      {
        params: {
          offset: params.offset || OFFSET,
          limit: params.limit || LIMIT,
        },
      }
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
