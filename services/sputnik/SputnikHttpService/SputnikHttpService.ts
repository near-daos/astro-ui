import {
  RequestQueryBuilder,
  SConditionAND,
  SFields,
} from '@nestjsx/crud-request';
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
  ProposalCategories,
  Proposal,
  ProposalType,
  ProposalComment,
  SendProposalComment,
  ReportProposalComment,
  DeleteProposalComment,
  ProposalFeedItem,
  ProposalsFeedStatuses,
} from 'types/proposal';
import { DaoContext } from 'types/context';
import {
  DaoStatsOvertime,
  DaoStatsProposalsOvertime,
  DaoStatsState,
} from 'types/daoStats';

import { GetProposalsResponse, MemberStats } from 'services/sputnik/mappers';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import {
  BaseParams,
  ActiveProposalsParams,
  ProposalsListParams,
  FilteredProposalsParams,
  DaoParams,
  SearchParams,
} from 'services/sputnik/types';
import { HttpService, httpService } from 'services/HttpService';
import { isUserPermittedToCreateProposal } from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { API_MAPPERS } from 'constants/mappers';

class SputnikHttpServiceClass {
  private readonly httpService: HttpService = httpService;

  public async getDaoContext(
    accountId: string | undefined,
    daoId: string
  ): Promise<DaoContext | undefined> {
    const [dao, policyAffectsProposals] = await Promise.all([
      this.getDaoById(daoId),
      this.findPolicyAffectsProposals(daoId),
    ]);

    if (!dao) {
      return undefined;
    }

    return {
      dao,
      userPermissions: {
        isCanCreateProposals: isUserPermittedToCreateProposal(accountId, dao),
        isCanCreatePolicyProposals: !policyAffectsProposals.length,
      },
      policyAffectsProposals,
    };
  }

  /* Daos API */
  public async getDaoList({
    offset = 0,
    limit = 500,
    sort = 'createdAt,DESC',
    filter,
    createdBy,
  }: BaseParams): Promise<PaginationResponse<DaoFeedItem[]>> {
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
  }

  public async getAccountDaos(accountId: string): Promise<DaoFeedItem[]> {
    const { data } = await this.httpService.get<DaoFeedItem[]>(
      `/daos/account-daos/${accountId}`,
      {
        responseMapper: {
          name: API_MAPPERS.MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEED,
        },
      }
    );

    return data;
  }

  public async getDaoById(id: string): Promise<DAO | null> {
    const { data } = await this.httpService.get<DAO | null>(`/daos/${id}`, {
      responseMapper: { name: API_MAPPERS.MAP_DAO_DTO_TO_DAO },
    });

    return data;
  }

  public async getDaoMembersStats(daoId: string): Promise<MemberStats[]> {
    const { data } = await this.httpService.get<MemberStats[]>(
      `/daos/${daoId}/members`
    );

    return data;
  }

  /* Search API */
  public async search(params: SearchParams): Promise<SearchResultsData | null> {
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
  }

  /* Proposals API */
  public async getActiveProposals({
    daoIds,
    offset = 0,
    limit = 50,
  }: ActiveProposalsParams): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'daoId',
        operator: '$in',
        value: daoIds,
      })
      .setFilter({
        field: 'status',
        operator: '$eq',
        value: 'InProgress',
      })
      .setLimit(limit)
      .setOffset(offset)
      .sortBy({
        field: 'createdAt',
        order: 'DESC',
      })
      .query();

    const { data } = await this.httpService.get<Proposal[]>(
      `/proposals?${queryString}`,
      {
        responseMapper: {
          name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS,
        },
      }
    );

    return data;
  }

  public async getUserProposals(accountId: string) {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'proposer',
        operator: '$eq',
        value: accountId,
      })
      .setLimit(500)
      .setOffset(0)
      .query();

    const response = await this.httpService.get<GetProposalsResponse>(
      `/proposals?${queryString}`
    );

    return response.data.data;
  }

  public async getProposalsList(
    query: ProposalsListParams,
    accountId?: string
  ): Promise<PaginationResponse<ProposalFeedItem[]>> {
    const queryString = RequestQueryBuilder.create();

    const search: SFields | SConditionAND = {
      $and: [],
    };

    // specific DAO
    if (query.daoId) {
      search.$and?.push({
        daoId: {
          $eq: query.daoId,
        },
      });
    }

    // Statuses
    if (
      query?.status === ProposalsFeedStatuses.Active ||
      query?.status === ProposalsFeedStatuses.VoteNeeded
    ) {
      search.$and?.push({
        status: {
          $eq: 'InProgress',
        },
        votePeriodEnd: {
          $gt: Date.now() * 1000000,
        },
        voteStatus: {
          $eq: 'Active',
        },
      });
    }

    if (query?.status === ProposalsFeedStatuses.Approved) {
      search.$and?.push({
        status: {
          $eq: 'Approved',
        },
      });
    }

    if (query?.status === ProposalsFeedStatuses.Failed) {
      search.$and?.push({
        $or: [
          {
            status: {
              $in: ['Rejected', 'Expired', 'Moved', 'Removed'],
            },
          },
          {
            status: {
              $ne: 'Approved',
            },
            votePeriodEnd: {
              $lt: Date.now() * 1000000,
            },
          },
        ],
      });
    }

    // Categories
    if (query.category === ProposalCategories.Polls) {
      search.$and?.push({
        kind: {
          $cont: ProposalType.Vote,
          $excl: ProposalType.ChangePolicy,
        },
      });
    }

    if (query.category === ProposalCategories.Governance) {
      search.$and?.push({
        $or: [
          {
            kind: {
              $cont: ProposalType.ChangeConfig,
            },
          },
          {
            kind: {
              $cont: ProposalType.ChangePolicy,
            },
          },
        ],
      });
    }

    if (query.category === ProposalCategories.Bounties) {
      search.$and?.push({
        $or: [
          {
            kind: {
              $cont: ProposalType.AddBounty,
            },
          },
          {
            kind: {
              $cont: ProposalType.BountyDone,
            },
          },
        ],
      });
    }

    if (query.category === ProposalCategories.Financial) {
      search.$and?.push({
        kind: {
          $cont: ProposalType.Transfer,
        },
      });
    }

    if (query.category === ProposalCategories.Members) {
      search.$and?.push({
        $or: [
          {
            kind: {
              $cont: ProposalType.AddMemberToRole,
            },
          },
          {
            kind: {
              $cont: ProposalType.RemoveMemberFromRole,
            },
          },
        ],
      });
    }

    if (search.$and?.length) {
      queryString.search(search);
    }

    // DaosIds
    if (query.daosIdsFilter) {
      queryString.setFilter({
        field: 'daoId',
        operator: '$in',
        value: query.daosIdsFilter,
      });
    }

    queryString
      .setLimit(query.limit ?? LIST_LIMIT_DEFAULT)
      .setOffset(query.offset ?? 0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC',
      })
      .query();

    if (accountId) {
      const { data } = await this.httpService.get<
        PaginationResponse<ProposalFeedItem[]>
      >(
        `/proposals/account-proposals/${accountId}?${queryString.queryString}${
          query.accountId ? `&accountId=${query.accountId}` : ''
        }${
          query?.status === ProposalsFeedStatuses.VoteNeeded
            ? '&filter=permissions.canApprove||$eq||true&filter=permissions.canReject||$eq||true&voted=false'
            : ''
        }`,
        {
          responseMapper: {
            name:
              API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
          },
        }
      );

      return data;
    }

    const { data } = await this.httpService.get<
      PaginationResponse<ProposalFeedItem[]>
    >(
      `/proposals?${queryString.queryString}${
        query.accountId ? `&accountId=${query.accountId}` : ''
      }`,
      {
        responseMapper: {
          name:
            API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
        },
      }
    );

    return data;
  }

  public async getProposalById(
    proposalId: string,
    accountId?: string
  ): Promise<ProposalFeedItem | null> {
    try {
      const queryString = RequestQueryBuilder.create();

      queryString.setFilter({
        field: 'id',
        operator: '$eq',
        value: proposalId,
      });

      queryString
        .setLimit(1)
        .setOffset(0)
        .sortBy({
          field: 'createdAt',
          order: 'DESC',
        })
        .query();

      const { data } = await this.httpService.get<
        PaginationResponse<ProposalFeedItem[]>
      >(
        `/proposals?${queryString.queryString}${
          accountId ? `&accountId=${accountId}` : ''
        }`,
        {
          responseMapper: {
            name:
              API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
          },
        }
      );

      return data.data[0];
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async findPolicyAffectsProposals(
    daoId: string
  ): Promise<ProposalFeedItem[]> {
    const queryString = RequestQueryBuilder.create();

    const search: SFields | SConditionAND = {
      $and: [
        {
          daoId: {
            $eq: daoId,
          },
        },
      ],
    };

    search.$and?.push({
      status: {
        $eq: 'InProgress',
      },
      votePeriodEnd: {
        $gt: Date.now() * 1000000,
      },
    });

    search.$and?.push({
      $or: [
        {
          kind: {
            $cont: ProposalType.ChangeConfig,
          },
        },
        {
          kind: {
            $cont: ProposalType.ChangePolicy,
          },
        },
      ],
    });

    queryString.search(search);

    queryString
      .setLimit(1000)
      .setOffset(0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC',
      })
      .query();

    const { data } = await this.httpService.get<
      PaginationResponse<ProposalFeedItem[]>
    >(`/proposals?${queryString.queryString}`, {
      responseMapper: {
        name: API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM,
      },
    });

    return data.data;
  }

  public async getFilteredProposals(
    filter: FilteredProposalsParams,
    accountId?: string
  ): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create();

    const search: SFields | SConditionAND = {
      $and: [],
    };

    // specific DAO
    if (filter.daoId) {
      search.$and?.push({
        daoId: {
          $eq: filter.daoId,
        },
      });
    } else if (filter.daoFilter === 'My DAOs' && accountId) {
      const accountDaos = await this.getAccountDaos(accountId);

      if (accountDaos.length) {
        search.$and?.push({
          daoId: {
            $in: accountDaos.map(item => item.id),
          },
        });
      } else {
        return Promise.resolve([]);
      }
    }

    // Statuses
    if (filter.status && filter.status === 'Active proposals') {
      // Fetch all InProgress items and then do additional filtering for Expired
      search.$and?.push({
        status: {
          $eq: 'InProgress',
        },
      });
    } else if (filter.status && filter.status === 'Approved') {
      search.$and?.push({
        status: {
          $eq: 'Approved',
        },
      });
    } else if (filter.status && filter.status === 'Failed') {
      // Fetch failed including InProgress items and then do additional filtering for Expired
      search.$and?.push({
        status: {
          $in: ['Rejected', 'Expired', 'Moved', 'InProgress'],
        },
      });
    }

    // Kinds
    if (filter.proposalFilter === 'Polls') {
      search.$and?.push({
        kind: {
          $cont: ProposalType.Vote,
          $excl: ProposalType.ChangePolicy,
        },
      });
    }

    if (filter.proposalFilter === 'Governance') {
      search.$and?.push({
        $or: [
          {
            kind: {
              $cont: ProposalType.ChangeConfig,
            },
          },
          {
            kind: {
              $cont: ProposalType.ChangePolicy,
            },
          },
        ],
      });
    }

    if (filter.proposalFilter === 'Financial') {
      search.$and?.push({
        kind: {
          $cont: ProposalType.Transfer,
        },
      });
    }

    if (filter.proposalFilter === 'Groups') {
      search.$and?.push({
        $or: [
          {
            kind: {
              $cont: ProposalType.AddMemberToRole,
            },
          },
          {
            kind: {
              $cont: ProposalType.RemoveMemberFromRole,
            },
          },
        ],
      });
    }

    queryString.search(search);

    // DaosIds
    if (filter.daosIdsFilter) {
      queryString.setFilter({
        field: 'daoId',
        operator: '$in',
        value: filter.daosIdsFilter,
      });
    }

    queryString
      .setLimit(1000)
      .setOffset(0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC',
      })
      .query();

    const { data: proposals } = await this.httpService.get<Proposal[]>(
      `/proposals?${queryString.queryString}`,
      {
        responseMapper: {
          name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS,
        },
      }
    );

    return proposals;
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
  }

  public async getAccountReceiptsByTokens(
    accountId: string,
    tokenId: string
  ): Promise<Receipt[]> {
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
  }

  public async getAccountReceipts(accountId: string): Promise<Receipt[]> {
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
  }

  public async getPolls({
    daoId,
    offset = 0,
    limit = 50,
  }: DaoParams): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create();

    const search: SFields | SConditionAND = {
      $and: [
        {
          daoId: {
            $eq: daoId,
          },
        },
        {
          kind: {
            $cont: ProposalType.Vote,
            $excl: ProposalType.ChangePolicy,
          },
        },
      ],
    };

    queryString.search(search);

    queryString
      .setLimit(limit ?? 1000)
      .setOffset(offset ?? 0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC',
      })
      .query();

    const { data: proposals } = await this.httpService.get<Proposal[]>(
      `/proposals?${queryString.queryString}`,
      {
        responseMapper: {
          name: API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS,
        },
      }
    );

    return proposals;
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
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async getBounties({
    sort = 'createdAt,DESC',
    offset = 0,
    limit = 50,
  }: BaseParams): Promise<PaginationResponse<BountiesResponse['data']>> {
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
  }

  public async getBountyContextById(
    bountyId: string,
    accountId?: string
  ): Promise<BountyContext> {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'id',
        operator: '$eq',
        value: bountyId,
      })
      .query();
    const { data } = await this.httpService.get<BountiesContextResponse>(
      `/bounty-contexts?${queryString}${
        accountId ? `&accountId=${accountId}` : ''
      }`
    );

    return data.data[0];
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
  ): Promise<PaginationResponse<BountyContext[]>> {
    const queryBuilder = RequestQueryBuilder.create();

    queryBuilder.setFilter({
      field: 'daoId',
      operator: '$eq',
      value: daoId,
    });

    if (query?.bountyFilter) {
      if (query.bountyFilter === 'proposer') {
        queryBuilder.setFilter({
          field: 'proposal.proposer',
          operator: '$eq',
          value: accountId,
        });
      }

      if (query.bountyFilter === 'numberOfClaims') {
        queryBuilder.setFilter({
          field: 'bounty.numberOfClaims',
          operator: '$eq',
          value: 0,
        });
      }
    }

    if (query?.bountyPhase) {
      // Proposal Phase
      if (query.bountyPhase === 'proposalPhase') {
        queryBuilder.setFilter({
          field: 'proposal.status',
          operator: '$eq',
          value: 'InProgress',
        });
      }

      // In progress
      if (query.bountyPhase === 'inProgress') {
        queryBuilder.setFilter({
          field: 'bounty.numberOfClaims',
          operator: '$ne',
          value: 0,
        });
      }

      // Available bounty
      if (query.bountyPhase === 'availableBounty') {
        queryBuilder.setFilter({
          field: 'bounty.times',
          operator: '$gte',
          value: 0,
        });
        queryBuilder.setFilter({
          field: 'bounty.numberOfClaims',
          operator: '$eq',
          value: 0,
        });
      }

      // Completed
      if (query.bountyPhase === 'completed') {
        queryBuilder.setFilter({
          field: 'bounty.times',
          operator: '$eq',
          value: 0,
        });
      }
    }

    const queryString = queryBuilder
      .setLimit(query?.limit ?? LIST_LIMIT_DEFAULT)
      .setOffset(query?.offset ?? 0)
      .query();

    let sort = 'createdAt,DESC';

    if (query?.bountySort) {
      sort = query.bountySort;
    }

    const { data } = await this.httpService.get<
      PaginationResponse<BountyContext[]>
    >(
      `/bounty-contexts?${queryString}${
        accountId ? `&accountId=${accountId}` : ''
      }`,
      {
        params: {
          sort,
        },
      }
    );

    return data;
  }

  public async findBountyContext(params: {
    offset?: number;
    limit?: number;
    sort?: string;
    daoId: string;
    query: string;
    cancelToken: CancelToken;
    accountId: string;
  }): Promise<PaginationResponse<BountyContext[]>> {
    const { accountId, daoId, query } = params;

    const queryBuilder = RequestQueryBuilder.create();

    queryBuilder.setFilter({
      field: 'daoId',
      operator: '$eq',
      value: daoId,
    });

    queryBuilder.setFilter({
      field: 'proposal.description',
      operator: '$cont',
      value: query,
    });

    const queryString = queryBuilder.setLimit(2000).setOffset(0).query();

    const sort = 'createdAt,DESC';

    const { data } = await this.httpService.get<
      PaginationResponse<BountyContext[]>
    >(
      `/bounty-contexts?${queryString}${
        accountId ? `&accountId=${accountId}` : ''
      }`,
      {
        params: {
          sort,
        },
        cancelToken: params.cancelToken,
      }
    );

    return data;
  }

  /* Tokens API */
  public async getAccountNFTs(accountId: string): Promise<NftToken[]> {
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
  }

  public async getTokens({
    offset = 0,
    limit = 50,
    sort = 'createdAt,DESC',
    filter = '',
  }: DaoParams): Promise<Token[]> {
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
  }

  public async getAccountTokens(accountId: string): Promise<Token[]> {
    const { data } = await this.httpService.get<Token[]>(
      `/tokens/account-tokens/${accountId}`,
      {
        responseMapper: {
          name: API_MAPPERS.MAP_TOKENS_DTO_TO_TOKEN,
        },
      }
    );

    return data;
  }

  /* Subscriptions API */
  public async getAccountDaoSubscriptions(
    accountId: string
  ): Promise<DaoSubscription[]> {
    const { data } = await this.httpService.get<DaoSubscription[]>(
      `/subscriptions/account-subscriptions/${accountId}`,
      {
        responseMapper: {
          name: API_MAPPERS.MAP_SUBSCRIPTIONS_DTOS_TO_DAO_SUBSCRIPTIONS,
        },
      }
    );

    return data;
  }

  public async updateAccountSubscription(
    params: UpdateDaoSubscription
  ): Promise<string> {
    const response = await this.httpService.post<
      UpdateDaoSubscription,
      { data: { accountId: string } }
    >(`/subscriptions`, params);

    return response.data.accountId;
  }

  public async deleteAccountSubscription(
    subscriptionId: string,
    params: DaoSubscriptionInput
  ): Promise<string> {
    const response = await this.httpService.delete<
      DaoSubscriptionInput,
      { data: { accountId: string } }
    >(`/subscriptions/${subscriptionId}`, params);

    return response.data.accountId;
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
    const response = await this.httpService.post<
      SendProposalComment,
      { data: { accountId: string } }
    >(`/comments`, params);

    return response.data.accountId;
  }

  public async reportProposalComment(
    params: ReportProposalComment
  ): Promise<string> {
    const response = await this.httpService.post<
      ReportProposalComment,
      { data: { accountId: string } }
    >(`/comments/report`, params);

    return response.data.accountId;
  }

  public async deleteProposalComment(
    commentId: number,
    params: DeleteProposalComment
  ): Promise<string> {
    const response = await this.httpService.delete<
      DeleteProposalComment,
      { data: { accountId: string } }
    >(`/comments/${commentId}`, params);

    return response.data.accountId;
  }

  /* Dao Stats API */
  public async getDaoStatsState(daoId: string): Promise<DaoStatsState> {
    const { data } = await this.httpService.get<DaoStatsState>(
      `/stats/dao/${daoId}/state`
    );

    return data;
  }

  public async getDaoStatsFunds(daoId: string): Promise<DaoStatsOvertime[]> {
    const { data } = await this.httpService.get<DaoStatsOvertime[]>(
      `/stats/dao/${daoId}/funds`
    );

    return data;
  }

  public async getDaoStatsBounties(daoId: string): Promise<DaoStatsOvertime[]> {
    const { data } = await this.httpService.get<DaoStatsOvertime[]>(
      `/stats/dao/${daoId}/bounties`
    );

    return data;
  }

  public async getDaoStatsNfts(daoId: string): Promise<DaoStatsOvertime[]> {
    const { data } = await this.httpService.get<DaoStatsOvertime[]>(
      `/stats/dao/${daoId}/nfts`
    );

    return data;
  }

  public async getDaoStatsProposals(
    daoId: string
  ): Promise<DaoStatsProposalsOvertime[]> {
    const { data } = await this.httpService.get<DaoStatsProposalsOvertime[]>(
      `/stats/dao/${daoId}/proposals`
    );

    return data;
  }
}

export const SputnikHttpService = new SputnikHttpServiceClass();
