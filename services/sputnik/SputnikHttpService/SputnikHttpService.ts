import omit from 'lodash/omit';
import { CancelToken } from 'axios';

import { PaginationResponse } from 'types/api';
import { NftToken, Token } from 'types/token';
import {
  DAO,
  DaoFeedItem,
  DaoSubscription,
  DaoSubscriptionInput,
  UpdateDaoSubscription,
} from 'types/dao';
import { Receipt } from 'types/transaction';
import { SearchResultsData } from 'types/search';
import {
  BountiesContextResponse,
  BountiesResponse,
  BountyContext,
} from 'types/bounties';
import {
  Proposal,
  ProposalComment,
  SendProposalComment,
  ReportProposalComment,
  DeleteProposalComment,
  ProposalFeedItem,
} from 'types/proposal';
import { DaoStatsState } from 'types/daoStats';

import {
  GetProposalsResponse,
  MemberStats,
  ProposalDTO,
} from 'services/sputnik/mappers';
import { API_MAPPERS, API_QUERIES } from 'services/sputnik/constants';
import {
  BaseParams,
  ActiveProposalsParams,
  ProposalsListParams,
  FilteredProposalsParams,
  DaoParams,
  SearchParams,
} from 'services/sputnik/types';
import { HttpService, httpService } from 'services/HttpService';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

class SputnikHttpServiceClass {
  private readonly httpService: HttpService = httpService;

  /* Daos API */
  public async getDaoList({
    offset = 0,
    limit = 500,
    sort = 'createdAt,DESC',
    filter,
    createdBy,
  }: BaseParams): Promise<PaginationResponse<DaoFeedItem[]> | null> {
    try {
      const { data } = await this.httpService.get<
        PaginationResponse<DaoFeedItem[]>
      >('/daos', {
        responseMapper: {
          name: API_MAPPERS.MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEEDS,
        },
        params: {
          filter,
          offset,
          limit,
          sort,
          createdBy,
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getAccountDaos(accountId: string): Promise<DaoFeedItem[]> {
    try {
      const { data } = await this.httpService.get<DaoFeedItem[]>(
        `/daos/account-daos/${accountId}`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEED,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getDaoById(id: string): Promise<DAO | null> {
    try {
      const { data } = await this.httpService.get<DAO | null>(`/daos/${id}`, {
        responseMapper: { name: API_MAPPERS.MAP_DAO_DTO_TO_DAO },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getDaoMembersStats(daoId: string): Promise<MemberStats[]> {
    try {
      const { data } = await this.httpService.get<MemberStats[]>(
        `/daos/${daoId}/members`
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  /* Search API */
  public async search(params: SearchParams): Promise<SearchResultsData | null> {
    try {
      const { data } = await this.httpService.get<SearchResultsData | null>(
        '/search',
        {
          responseMapper: {
            name: API_MAPPERS.MAP_SEARCH_RESULTS_DTO_TO_DATA_OBJECT,
          },
          params: {
            query: params.query,
            accountId: params.accountId,
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

  /* Proposals API */
  public async getActiveProposals({
    daoIds,
    offset = 0,
    limit = 50,
  }: ActiveProposalsParams): Promise<Proposal[]> {
    try {
      const { data } = await this.httpService.get<Proposal[]>('/proposals', {
        responseMapper: {
          name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS,
        },
        queryRequest: {
          name: API_QUERIES.GET_ACTIVE_PROPOSALS,
          params: {
            daoIds,
            offset,
            limit,
          },
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getUserProposals(accountId: string): Promise<ProposalDTO[]> {
    try {
      const response = await this.httpService.get<GetProposalsResponse>(
        '/proposals',
        {
          queryRequest: {
            name: API_QUERIES.GET_USER_PROPOSALS,
            params: {
              accountId,
            },
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getProposalsListByAccountId(
    query: ProposalsListParams,
    accountId?: string
  ): Promise<PaginationResponse<ProposalFeedItem[]> | null> {
    try {
      const { data } = await this.httpService.get<
        PaginationResponse<ProposalFeedItem[]>
      >('/proposals/account-proposals', {
        responseMapper: {
          name:
            API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
        },
        queryRequest: {
          name: API_QUERIES.GET_PROPOSALS_LIST_BY_ACCOUNT_ID,
          params: {
            query,
            accountId,
          },
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getProposalsList(
    query: ProposalsListParams
  ): Promise<PaginationResponse<ProposalFeedItem[]> | null> {
    try {
      const { data } = await this.httpService.get<
        PaginationResponse<ProposalFeedItem[]>
      >('/proposals', {
        responseMapper: {
          name:
            API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
        },
        queryRequest: {
          name: API_QUERIES.GET_PROPOSALS_LIST,
          params: {
            query,
          },
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getProposalById(
    proposalId: string,
    accountId?: string
  ): Promise<ProposalFeedItem | null> {
    try {
      const { data } = await this.httpService.get<
        PaginationResponse<ProposalFeedItem[]>
      >('/proposals', {
        responseMapper: {
          name:
            API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
        },
        queryRequest: {
          name: API_QUERIES.GET_PROPOSAL_BY_ID,
          params: {
            proposalId,
            accountId,
          },
        },
      });

      return data.data[0];
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async findPolicyAffectsProposals(
    daoId: string
  ): Promise<ProposalFeedItem[]> {
    try {
      const { data } = await this.httpService.get<
        PaginationResponse<ProposalFeedItem[]>
      >('/proposals', {
        responseMapper: {
          name:
            API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
        },
        queryRequest: {
          name: API_QUERIES.FIND_POLICY_AFFECTS_PROPOSALS,
          params: {
            daoId,
          },
        },
      });

      return data.data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getFilteredProposals(
    filter: FilteredProposalsParams,
    accountDaos?: DaoFeedItem[]
  ): Promise<Proposal[]> {
    try {
      const { data: proposals } = await this.httpService.get<Proposal[]>(
        '/proposals',
        {
          responseMapper: {
            name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS,
          },
          queryRequest: {
            name: API_QUERIES.GET_FILTERED_PROPOSALS,
            params: {
              filter,
              accountDaos,
            },
          },
        }
      );

      return proposals;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getProposals({
    daoId,
    offset = 0,
    limit = 50,
  }: DaoParams): Promise<Proposal[]> {
    const params = {
      filter: `daoId||$eq||${daoId}`,
      offset,
      limit,
    };

    try {
      const { data: proposals } = await this.httpService.get<Proposal[]>(
        '/proposals',
        {
          responseMapper: {
            name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS,
          },
          params: daoId ? params : omit(params, 'filter'),
        }
      );

      return proposals;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getAccountReceiptsByTokens(
    accountId: string,
    tokenId: string
  ): Promise<Receipt[]> {
    try {
      const { data } = await this.httpService.get<Receipt[]>(
        `/transactions/receipts/account-receipts/${accountId}/tokens/${tokenId}`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_RECEIPTS_BY_TOKEN_RESPONSE,
            params: {
              accountId,
              tokenId,
            },
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getAccountReceipts(accountId: string): Promise<Receipt[]> {
    try {
      const { data } = await this.httpService.get<Receipt[]>(
        `/transactions/receipts/account-receipts/${accountId}`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_RECEIPTS_RESPONSE,
            params: {
              accountId,
            },
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getPolls({
    daoId,
    offset = 0,
    limit = 50,
  }: DaoParams): Promise<Proposal[]> {
    try {
      const { data: proposals } = await this.httpService.get<Proposal[]>(
        '/proposals',
        {
          responseMapper: {
            name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS,
          },
          queryRequest: {
            name: API_QUERIES.GET_POLLS,
            params: {
              daoId,
              offset,
              limit,
            },
          },
        }
      );

      return proposals;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getProposal(
    contractId: string,
    index: number
  ): Promise<Proposal | null> {
    try {
      const { data: proposal } = await this.httpService.get<Proposal | null>(
        `/proposals/${contractId}-${index}`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSAL,
          },
        }
      );

      return proposal;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getBounties({
    sort = 'createdAt,DESC',
    offset = 0,
    limit = 50,
  }: BaseParams): Promise<PaginationResponse<BountiesResponse['data']> | null> {
    try {
      const { data } = await this.httpService.get<
        PaginationResponse<BountiesResponse['data']>
      >('/bounties', {
        params: {
          offset,
          limit,
          sort,
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getBountyContextById(
    bountyId: string,
    accountId?: string
  ): Promise<BountyContext | null> {
    try {
      const { data } = await this.httpService.get<BountiesContextResponse>(
        '/bounty-contexts',
        {
          queryRequest: {
            name: API_QUERIES.GET_BOUNTY_CONTEXT_BY_ID,
            params: {
              bountyId,
              accountId,
            },
          },
        }
      );

      return data.data[0];
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getBountiesContext(
    daoId: string,
    accountId?: string,
    query?: {
      bountyFilter: string | null;
      bountySort: string | null;
      bountyPhase: string | null;
      limit?: number;
      offset?: number;
    }
  ): Promise<PaginationResponse<BountyContext[]> | null> {
    try {
      const { data } = await this.httpService.get<
        PaginationResponse<BountyContext[]>
      >(`/bounty-contexts`, {
        queryRequest: {
          name: API_QUERIES.GET_BOUNTIES_CONTEXT,
          params: {
            accountId: accountId || '',
            daoId,
            query,
          },
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async findBountyContext(params: {
    offset?: number;
    limit?: number;
    sort?: string;
    daoId: string;
    query: string;
    cancelToken: CancelToken;
    accountId: string;
  }): Promise<PaginationResponse<BountyContext[]> | null> {
    const { accountId, daoId, query } = params;

    try {
      const { data } = await this.httpService.get<
        PaginationResponse<BountyContext[]>
      >('/bounty-contexts', {
        cancelToken: params.cancelToken,
        queryRequest: {
          name: API_QUERIES.FIND_BOUNTY_CONTEXT,
          params: {
            accountId,
            daoId,
            query,
          },
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async toggleBountyContexts(params: {
    accountId: string;
    publicKey: string;
    signature: string;
    ids: string[];
    daoId: string;
    isArchived: boolean;
  }): Promise<string> {
    const response = await this.httpService.patch<
      {
        accountId: string;
        publicKey: string;
        signature: string;
        ids: string[];
        daoId: string;
        isArchived: boolean;
      },
      { data: string }
    >(`/bounty-contexts`, params);

    return response.data;
  }

  public async showBounties(
    selected: string[],
    params: {
      accountId: string;
      publicKey: string;
      signature: string;
      daoId: string;
    }
  ): Promise<boolean> {
    // todo - add service action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await this.httpService.patch<any, boolean>(
      `/bounties-contexts`,
      params
    );

    return response;
  }

  public async findDaoByName(params: {
    offset?: number;
    limit?: number;
    sort?: string;
    query: string;
    cancelToken: CancelToken;
  }): Promise<PaginationResponse<DaoFeedItem[]> | null> {
    const { query } = params;

    try {
      const { data } = await this.httpService.get<
        PaginationResponse<DaoFeedItem[]>
      >('/daos', {
        cancelToken: params.cancelToken,
        queryRequest: {
          name: API_QUERIES.FIND_DAO_BY_NAME,
          params: {
            query,
          },
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  /* Tokens API */
  public async getAccountNFTs(accountId: string): Promise<NftToken[]> {
    try {
      const { data } = await this.httpService.get<NftToken[]>(`/tokens/nfts`, {
        responseMapper: {
          name: API_MAPPERS.MAP_NFT_TOKEN_RESPONSE_TO_NFT_TOKEN,
        },
        params: {
          filter: `ownerId||$eq||${accountId}`,
          sort: 'createdAt,DESC',
          offset: 0,
          limit: 1000,
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getTokens({
    offset = 0,
    limit = 50,
    sort = 'createdAt,DESC',
    filter = '',
  }: DaoParams): Promise<Token[]> {
    try {
      const { data } = await this.httpService.get<Token[]>('/tokens', {
        responseMapper: {
          name: API_MAPPERS.MAP_TOKENS_DTO_TO_TOKENS,
        },
        params: {
          offset,
          limit,
          sort,
          filter,
        },
      });

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getAccountTokens(accountId: string): Promise<Token[]> {
    try {
      const { data } = await this.httpService.get<Token[]>(
        `/tokens/account-tokens/${accountId}`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_TOKENS_DTO_TO_TOKEN,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  /* Subscriptions API */
  public async getAccountDaoSubscriptions(
    accountId: string
  ): Promise<DaoSubscription[]> {
    try {
      const { data } = await this.httpService.get<DaoSubscription[]>(
        `/subscriptions/account-subscriptions/${accountId}`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_SUBSCRIPTIONS_DTOS_TO_DAO_SUBSCRIPTIONS,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async updateAccountSubscription(
    params: UpdateDaoSubscription
  ): Promise<string> {
    try {
      const response = await this.httpService.post<
        UpdateDaoSubscription,
        { data: { accountId: string } }
      >(`/subscriptions`, params);

      return response.data.accountId;
    } catch (error) {
      console.error(error);

      return '';
    }
  }

  public async deleteAccountSubscription(
    subscriptionId: string,
    params: DaoSubscriptionInput
  ): Promise<string> {
    try {
      const response = await this.httpService.delete<
        DaoSubscriptionInput,
        { data: { accountId: string } }
      >(`/subscriptions/${subscriptionId}`, params);

      return response.data.accountId;
    } catch (error) {
      console.error(error);

      return '';
    }
  }

  /* Comments API */
  public async getProposalComments(
    proposalId: string
  ): Promise<ProposalComment[]> {
    const offset = 0;
    const limit = 3000;
    const sort = 'createdAt,DESC';

    const { data } = await this.httpService.get<
      PaginationResponse<ProposalComment[]>
    >(`/comments`, {
      params: {
        offset,
        limit,
        sort,
        filter: `contextId||$eq||${proposalId}`,
      },
    });

    return data.data;
  }

  public async sendProposalComment(
    params: SendProposalComment
  ): Promise<string> {
    try {
      const response = await this.httpService.post<
        SendProposalComment,
        { data: { accountId: string } }
      >(`/comments`, params);

      return response.data.accountId;
    } catch (error) {
      console.error(error);

      return '';
    }
  }

  public async reportProposalComment(
    params: ReportProposalComment
  ): Promise<string> {
    try {
      const response = await this.httpService.post<
        ReportProposalComment,
        { data: { accountId: string } }
      >(`/comments/report`, params);

      return response.data.accountId;
    } catch (error) {
      console.error(error);

      return '';
    }
  }

  public async deleteProposalComment(
    commentId: number,
    params: DeleteProposalComment
  ): Promise<string> {
    try {
      const response = await this.httpService.delete<
        DeleteProposalComment,
        { data: { accountId: string } }
      >(`/comments/${commentId}`, params);

      return response.data.accountId;
    } catch (error) {
      console.error(error);

      return '';
    }
  }

  /* Dao Stats API */
  public async getDaoStatsState(daoId: string): Promise<DaoStatsState | null> {
    try {
      const { data } = await this.httpService.get<DaoStatsState | null>(
        `/stats/dao/${daoId}/state`
      );

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getDaoStatsFunds(daoId: string): Promise<ChartDataElement[]> {
    try {
      const { data } = await this.httpService.get<ChartDataElement[]>(
        `/stats/dao/${daoId}/funds`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_OVERTIME_TO_CHART_DATA,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getDaoStatsBounties(daoId: string): Promise<ChartDataElement[]> {
    try {
      const { data } = await this.httpService.get<ChartDataElement[]>(
        `/stats/dao/${daoId}/bounties`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_OVERTIME_TO_CHART_DATA,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getDaoStatsNfts(daoId: string): Promise<ChartDataElement[]> {
    try {
      const { data } = await this.httpService.get<ChartDataElement[]>(
        `/stats/dao/${daoId}/nfts`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_OVERTIME_TO_CHART_DATA,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getDaoStatsProposals(
    daoId: string
  ): Promise<ChartDataElement[]> {
    try {
      const { data } = await this.httpService.get<ChartDataElement[]>(
        `/stats/dao/${daoId}/proposals`,
        {
          responseMapper: {
            name: API_MAPPERS.MAP_PROPOSALS_OVERTIME_TO_CHART_DATA,
          },
        }
      );

      return data;
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}

export const SputnikHttpService = new SputnikHttpServiceClass();
