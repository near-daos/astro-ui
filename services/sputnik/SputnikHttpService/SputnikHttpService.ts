import {
  QueryFilter,
  RequestQueryBuilder,
  SConditionAND,
  SFields,
} from '@nestjsx/crud-request';
import omit from 'lodash/omit';

import { PaginationResponse } from 'types/api';
import {
  GetNFTTokensResponse,
  GetTokensResponse,
  NftToken,
  Token,
  TokenResponse,
} from 'types/token';
import {
  DAO,
  DaoSubscription,
  DaoSubscriptionInput,
  UpdateDaoSubscription,
} from 'types/dao';
import { Receipt } from 'types/transaction';
import { SearchResultsData } from 'types/search';
import { BountiesResponse, Bounty, BountyStatus } from 'types/bounties';
import {
  BountyDoneProposalType,
  ProposalCategories,
  Proposal,
  ProposalStatuses,
  ProposalType,
  ProposalComment,
  SendProposalComment,
  ReportProposalComment,
  DeleteProposalComment,
} from 'types/proposal';

import { ProposalsQueries } from 'services/sputnik/types/proposals';
import {
  ProposalFilterOptions,
  ProposalFilterStatusOptions,
} from 'features/member-home/types';
import {
  DaoDTO,
  DaoSubscriptionDTO,
  GetDAOsResponse,
  GetProposalsResponse,
  mapBountyResponseToBounty,
  mapDaoDTOListToDaoList,
  mapDaoDTOtoDao,
  mapProposalDTOToProposal,
  mapProposalDTOToProposalExt,
  mapReceiptsByTokenResponse,
  mapReceiptsResponse,
  mapSearchResultsDTOToDataObject,
  mapSubscriptionsDTOsToDaoSubscriptions,
  mapTokensDTOToTokens,
  ProposalDTO,
  ReceiptDTO,
  SearchResponse,
} from 'services/sputnik/mappers';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { HttpService, httpService } from 'services/HttpService';
import { DaoContext } from 'types/context';
import { isUserPermittedToCreateProposal } from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { mapNftTokenResponseToNftToken } from 'services/sputnik/mappers/nfts';
import { CancelToken } from 'axios';

class SputnikHttpServiceClass {
  private readonly httpService: HttpService = httpService;

  public async getDaoList(params?: {
    offset?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    createdBy?: string;
  }): Promise<{ data: DAO[]; total: number }> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 500;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<GetDAOsResponse>('/daos', {
      params: {
        filter: params?.filter,
        offset,
        limit,
        sort,
        createdBy: params?.createdBy,
      },
    });

    return {
      data: mapDaoDTOListToDaoList(data.data),
      total: data.total,
    };
  }

  public async getDaosFeed(params?: {
    offset?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    createdBy?: string;
  }): Promise<{ data: DAO[]; total: number }> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 500;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<GetDAOsResponse>('/daos/feed', {
      params: {
        filter: params?.filter,
        offset,
        limit,
        sort,
        createdBy: params?.createdBy,
      },
    });

    return {
      data: mapDaoDTOListToDaoList(data.data),
      total: data.total,
    };
  }

  public async getDaoById(id: string): Promise<DAO | null> {
    const { data } = await this.httpService.get<DaoDTO>(`/daos/feed/${id}`);

    return mapDaoDTOtoDao(data);
  }

  public async search(params: {
    offset?: number;
    limit?: number;
    sort?: string;
    query: string;
    cancelToken: CancelToken;
  }): Promise<SearchResultsData | null> {
    const result = await this.httpService.get<SearchResponse>('/search', {
      params: {
        query: params.query,
      },
      cancelToken: params.cancelToken,
    });

    return mapSearchResultsDTOToDataObject(params.query, {
      daos: (result.data as SearchResponse)?.daos?.data as DaoDTO[],
      proposals: (result.data as SearchResponse)?.proposals
        ?.data as ProposalDTO[],
      members: [],
    });
  }

  public async getAccountDaos(accountId: string): Promise<DAO[]> {
    const { data } = await this.httpService.get<DaoDTO[]>(
      `/daos/account-daos/${accountId}`
    );

    return mapDaoDTOListToDaoList(data);
  }

  public async getBountiesDone(
    daoId: string
  ): Promise<BountyDoneProposalType[]> {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'daoId',
        operator: '$eq',
        value: daoId,
      })
      .setFilter({
        field: 'kind',
        operator: '$cont',
        value: ProposalType.BountyDone,
      })
      .setFilter({
        field: 'status',
        operator: '$eq',
        value: 'Approved',
      })
      .setLimit(500)
      .setOffset(0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC',
      })
      .query();

    const { data: bounties } = await this.httpService.get<GetProposalsResponse>(
      `/proposals?${queryString}`
    );

    return bounties.data
      .map(mapProposalDTOToProposal)
      .map(bountyDoneProposal => ({
        ...(bountyDoneProposal.kind as BountyDoneProposalType),
        completedDate: bountyDoneProposal.createdAt,
      }));
  }

  public async getActiveProposals(
    daoIds: string[],
    offset = 0,
    limit = 50
  ): Promise<Proposal[]> {
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

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >(`/proposals?${queryString}`);

    return proposals.data.map(mapProposalDTOToProposal);
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
        isCanCreateProposals:
          isUserPermittedToCreateProposal(accountId, dao) &&
          !policyAffectsProposals.length,
      },
      policyAffectsProposals,
    };
  }

  public async getProposalsList(
    query: ProposalsQueries & {
      daoId?: string | null;
      daoFilter?: 'All DAOs' | 'My DAOs' | 'Following DAOs' | null;
      daosIdsFilter?: string[];
      limit?: number;
      offset?: number;
    },
    accountId?: string
  ): Promise<PaginationResponse<Proposal[]>> {
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
    } else if (query.daoFilter === 'My DAOs' && accountId) {
      const accountDaos = await this.getAccountDaos(accountId);

      if (accountDaos.length) {
        search.$and?.push({
          daoId: {
            $in: accountDaos.map(item => item.id),
          },
        });
      } else {
        return Promise.resolve({
          data: [],
          count: 0,
          pageCount: 1,
          page: 1,
          total: 0,
        });
      }
    }

    // Statuses
    if (query?.status === ProposalStatuses.Active) {
      search.$and?.push({
        status: {
          $eq: 'InProgress',
        },
        votePeriodEnd: {
          $gt: Date.now() * 1000000,
        },
      });
    }

    if (query?.status === ProposalStatuses.Approved) {
      search.$and?.push({
        status: {
          $eq: 'Approved',
        },
      });
    }

    if (query?.status === ProposalStatuses.Failed) {
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

    queryString.search(search);

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
        PaginationResponse<GetProposalsResponse['data']>
      >(`/proposals/account-proposals/${accountId}?${queryString.queryString}`);

      return { ...data, data: data.data.map(mapProposalDTOToProposalExt) };
    }

    const { data } = await this.httpService.get<
      PaginationResponse<GetProposalsResponse['data']>
    >(`/proposals?${queryString.queryString}`);

    return { ...data, data: data.data.map(mapProposalDTOToProposalExt) };
  }

  public async getProposalById(proposalId: string): Promise<Proposal | null> {
    try {
      const { data: proposal } = await this.httpService.get<ProposalDTO>(
        `/proposals/${proposalId}`
      );

      return mapProposalDTOToProposalExt(proposal);
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async findPolicyAffectsProposals(daoId: string): Promise<Proposal[]> {
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

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >(`/proposals?${queryString.queryString}`);

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getFilteredProposals(
    filter: {
      daoId?: string | null;
      daoFilter?: 'All DAOs' | 'My DAOs' | 'Following DAOs' | null;
      proposalFilter?: ProposalFilterOptions;
      status?: ProposalFilterStatusOptions;
      daosIdsFilter?: string[];
    },
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

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >(`/proposals?${queryString.queryString}`);

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getProposals(
    daoId?: string,
    offset = 0,
    limit = 50
  ): Promise<Proposal[]> {
    const params = {
      filter: `daoId||$eq||${daoId}`,
      offset,
      limit,
    };

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >('/proposals', {
      params: daoId ? params : omit(params, 'filter'),
    });

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getAccountReceiptsByTokens(
    accountId: string,
    tokenId: string
  ): Promise<Receipt[]> {
    const { data } = await this.httpService.get<ReceiptDTO[]>(
      `/transactions/receipts/account-receipts/${accountId}/tokens/${tokenId}`
    );

    return mapReceiptsByTokenResponse(accountId, tokenId, data);
  }

  public async getAccountReceipts(accountId: string): Promise<Receipt[]> {
    const { data } = await this.httpService.get<ReceiptDTO[]>(
      `/transactions/receipts/account-receipts/${accountId}`
    );

    return mapReceiptsResponse(accountId, data);
  }

  public async getPolls(
    daoId: string,
    offset = 0,
    limit = 50
  ): Promise<Proposal[]> {
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

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >(`/proposals?${queryString.queryString}`);

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getProposal(
    contractId: string,
    index: number
  ): Promise<Proposal | null> {
    try {
      const { data: proposal } = await this.httpService.get<ProposalDTO>(
        `/proposals/${contractId}-${index}`
      );

      return mapProposalDTOToProposal(proposal);
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async getBounties(params?: {
    offset?: number;
    limit?: number;
    sort?: string;
  }): Promise<PaginationResponse<BountiesResponse['data']>> {
    const sort = params?.sort ?? 'createdAt,DESC';
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;

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

  public async getBountiesByDaoId(
    daoId: string,
    bountyStatus?: BountyStatus
  ): Promise<Bounty[]> {
    const buildFilter = (): QueryFilter[] => {
      const filter: QueryFilter[] = [
        { field: 'daoId', operator: '$eq', value: daoId },
      ];

      switch (bountyStatus) {
        case BountyStatus.Available:
          filter.push({ field: 'times', operator: '$ne', value: 0 });
          break;
        case BountyStatus.InProgress:
          filter.push(
            { field: 'numberOfClaims', operator: '$gt', value: 0 },
            {
              field: 'bountyClaims.endTime',
              operator: '$gt',
              value: Date.now() * 1000000,
            }
          );
          break;
        case BountyStatus.InProgressByMe:
          break;
        case BountyStatus.Expired:
          filter.push({
            field: 'bountyClaims.endTime',
            operator: '$lt',
            value: Date.now() * 1000000,
          });
          break;
        default:
          break;
      }

      return filter;
    };

    const queryString = RequestQueryBuilder.create()
      .setFilter(buildFilter())
      .query();

    const { data } = await this.httpService.get<BountiesResponse>(
      `/bounties?${queryString}`
    );

    return data.data.map(mapBountyResponseToBounty);
  }

  public async getActiveBountyDoneProposalsByDaoId(daoId: string) {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'daoId',
        operator: '$eq',
        value: daoId,
      })
      .setFilter({
        field: 'type',
        operator: '$eq',
        value: 'BountyDone',
      })
      .setFilter({
        field: 'voteStatus',
        operator: '$eq',
        value: 'Active',
      })
      .setFilter({
        field: 'status',
        operator: '$eq',
        value: 'InProgress',
      })
      .query();

    const { data } = await this.httpService.get<GetProposalsResponse>(
      `/proposals?${queryString}`
    );

    return data.data.map(mapProposalDTOToProposal);
  }

  public async getAccountNFTs(accountId: string): Promise<NftToken[]> {
    const { data } = await this.httpService.get<GetNFTTokensResponse>(
      `/tokens/nfts`,
      {
        params: {
          filter: `ownerId||$eq||${accountId}`,
          sort: 'createdAt,DESC',
          offset: 0,
          limit: 1000,
        },
      }
    );

    return mapNftTokenResponseToNftToken(data.data);
  }

  public async getAllTokens(): Promise<Token[]> {
    const offset = 0;
    const limit = 1000;
    const sort = 'createdAt,DESC';

    const { data } = await this.httpService.get<GetTokensResponse>('/tokens', {
      params: {
        offset,
        limit,
        sort,
      },
    });

    return mapTokensDTOToTokens(data.data);
  }

  public async getTokens(params: {
    dao: string;
    offset?: number;
    limit?: number;
    sort?: string;
  }): Promise<Token[]> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<GetTokensResponse>('/tokens', {
      params: {
        filter: `ownerId||$eq||${params.dao}`,
        offset,
        limit,
        sort,
      },
    });

    return mapTokensDTOToTokens(data.data);
  }

  public async getAccountTokens(accountId: string): Promise<Token[]> {
    const { data } = await this.httpService.get<TokenResponse[]>(
      `/tokens/account-tokens/${accountId}`
    );

    return mapTokensDTOToTokens(data);
  }

  public async getAccountDaoSubscriptions(
    accountId: string
  ): Promise<DaoSubscription[]> {
    const { data } = await this.httpService.get<DaoSubscriptionDTO[]>(
      `/subscriptions/account-subscriptions/${accountId}`
    );

    return mapSubscriptionsDTOsToDaoSubscriptions(data);
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
        filter: `proposalId||$eq||${proposalId}`,
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
}

export const SputnikHttpService = new SputnikHttpServiceClass();
