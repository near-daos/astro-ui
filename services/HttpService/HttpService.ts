/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  RequestQueryBuilder,
  SConditionAND,
  SFields,
} from '@nestjsx/crud-request';

// Mappers
import {
  mapDaoDTOtoDao,
  mapDaoFeedItemResponseToDaoFeedItemList,
  mapProposalDTOToProposal,
  mapProposalFeedItemResponseToProposalFeedItem,
  mapReceiptsByTokenResponse,
  mapReceiptsResponse,
  mapSearchResultsDTOToDataObject,
  mapSubscriptionsDTOsToDaoSubscriptions,
  mapTokensDTOToTokens,
  mapOvertimeToChartData,
  mapProposalsOvertimeToChartData,
} from 'services/sputnik/mappers';
import { mapNftTokenResponseToNftToken } from 'services/sputnik/mappers/nfts';

import {
  API_MAPPERS,
  ApiMappers,
  API_QUERIES,
  ApiQueries,
  LIST_LIMIT_DEFAULT,
} from 'services/sputnik/constants';
import { appConfig } from 'config';
import {
  ProposalCategories,
  ProposalsFeedStatuses,
  ProposalType,
} from 'types/proposal';
import { DaoFeedItem } from 'types/dao';

interface Mapper {
  name: ApiMappers | string;
  params?: { [key: string]: string };
}

interface Query {
  name: ApiQueries | string;
  params?: { [key: string]: any };
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  responseMapper?: Mapper;
  queryRequest?: Query;
}

export class HttpService {
  private readonly client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: appConfig.apiUrl,
      ...config,
    });

    this.client.interceptors.request.use(request => {
      const requestCustom: CustomAxiosRequestConfig = request;

      switch (requestCustom.queryRequest?.name) {
        case API_QUERIES.GET_BOUNTIES_CONTEXT:
          {
            const { query, accountId, daoId } =
              requestCustom.queryRequest?.params || {};
            const queryBuilder = RequestQueryBuilder.create();

            queryBuilder.setFilter({
              field: 'daoId',
              operator: '$eq',
              value: daoId,
            });

            queryBuilder.setFilter({
              field: 'proposal.status',
              operator: '$notin',
              value: ['Rejected', 'Removed', 'Expired'],
            });
            queryBuilder.setFilter({
              field: 'proposal.voteStatus',
              operator: 'ne',
              value: 'Expired',
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

              if (query.bountyFilter === 'hidden') {
                queryBuilder.setFilter({
                  field: 'isArchived',
                  operator: '$eq',
                  value: true,
                });
              } else {
                queryBuilder.setFilter({
                  field: 'isArchived',
                  operator: '$eq',
                  value: false,
                });
              }
            } else {
              queryBuilder.setFilter({
                field: 'isArchived',
                operator: '$eq',
                value: false,
              });
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
                queryBuilder.setFilter({
                  field: 'bounty.times',
                  operator: '$ne',
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

            request.url = `/bounty-contexts?${queryString}${
              accountId ? `&accountId=${accountId}` : ''
            }`;
            request.params = { sort };
          }
          break;
        case API_QUERIES.GET_ACTIVE_PROPOSALS:
          {
            const { daoIds, limit, offset } =
              requestCustom.queryRequest?.params || {};

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

            request.url = `/proposals?${queryString}`;
          }
          break;
        case API_QUERIES.GET_USER_PROPOSALS:
          {
            const { accountId } = requestCustom.queryRequest?.params || {};

            const queryString = RequestQueryBuilder.create()
              .setFilter({
                field: 'proposer',
                operator: '$eq',
                value: accountId,
              })
              .setLimit(500)
              .setOffset(0)
              .query();

            request.url = `/proposals?${queryString}`;
          }
          break;
        case API_QUERIES.GET_PROPOSAL_BY_ID:
          {
            const { proposalId, accountId } =
              requestCustom.queryRequest?.params || {};

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

            request.url = `/proposals?${queryString.queryString}${
              accountId ? `&accountId=${accountId}` : ''
            }`;
          }
          break;
        case API_QUERIES.FIND_POLICY_AFFECTS_PROPOSALS:
          {
            const { daoId } = requestCustom.queryRequest?.params || {};

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

            request.url = `/proposals?${queryString.queryString}`;
          }
          break;
        case API_QUERIES.GET_JOINING_DAO_PROPOSALS:
          {
            const { daoId, accountId } =
              requestCustom.queryRequest?.params || {};

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
              kind: {
                $cont: ProposalType.AddMemberToRole,
              },
            });

            search.$and?.push({
              kind: {
                $cont: ProposalType.AddMemberToRole,
              },
            });
            search.$and?.push({
              kind: {
                $cont: accountId,
              },
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

            request.url = `/proposals/account-proposals/${accountId}?${queryString.queryString}`;
          }
          break;
        case API_QUERIES.GET_FILTERED_PROPOSALS:
          {
            const { filter, accountDaos } =
              requestCustom.queryRequest?.params || {};

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
            } else if (filter.daoFilter === 'My DAOs') {
              if (accountDaos.length) {
                search.$and?.push({
                  daoId: {
                    $in: accountDaos.map((item: DaoFeedItem) => item.id),
                  },
                });
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

            request.url = `/proposals?${queryString.queryString}`;
          }
          break;
        case API_QUERIES.GET_POLLS:
          {
            const { limit, daoId, offset } =
              requestCustom.queryRequest?.params || {};
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

            request.url = `/proposals?${queryString.queryString}`;
          }
          break;
        case API_QUERIES.GET_BOUNTY_CONTEXT_BY_ID:
          {
            const { bountyId, accountId } =
              requestCustom.queryRequest?.params || {};

            const queryString = RequestQueryBuilder.create()
              .setFilter({
                field: 'id',
                operator: '$eq',
                value: bountyId,
              })
              .query();

            request.url = `/bounty-contexts?${queryString}${
              accountId ? `&accountId=${accountId}` : ''
            }`;
          }
          break;
        case API_QUERIES.FIND_BOUNTY_CONTEXT:
          {
            const { daoId, query, accountId } =
              requestCustom.queryRequest?.params || {};

            const queryBuilder = RequestQueryBuilder.create();

            queryBuilder.setFilter({
              field: 'daoId',
              operator: '$eq',
              value: daoId,
            });

            queryBuilder.setFilter({
              field: 'proposal.description',
              operator: '$contL',
              value: query,
            });

            const queryString = queryBuilder
              .setLimit(2000)
              .setOffset(0)
              .query();

            request.url = `/bounty-contexts?${queryString}${
              accountId ? `&accountId=${accountId}` : ''
            }`;
            request.params = { sort: 'createdAt,DESC' };
          }
          break;
        case API_QUERIES.FIND_DAO_BY_NAME:
          {
            const { query } = requestCustom.queryRequest?.params || {};

            const queryBuilder = RequestQueryBuilder.create();

            queryBuilder.setFilter({
              field: 'id',
              operator: '$contL',
              value: query,
            });
            // queryBuilder.setOr({
            //   field: 'id',
            //   operator: '$contL',
            //   value: query,
            // });

            // todo - use pagination to limit results
            const queryString = queryBuilder
              .setLimit(2000)
              .setOffset(0)
              .query();

            request.url = `/daos?${queryString}`;
            request.params = { sort: 'createdAt,DESC' };
          }
          break;
        case API_QUERIES.GET_PROPOSALS_LIST:
        case API_QUERIES.GET_PROPOSALS_LIST_BY_ACCOUNT_ID:
          {
            const { query, accountId } =
              requestCustom.queryRequest?.params || {};

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
              request.url = `/proposals/account-proposals/${accountId}?${
                queryString.queryString
              }${query.accountId ? `&accountId=${query.accountId}` : ''}`;
            } else {
              request.url = `/proposals?${queryString.queryString}${
                query.accountId ? `&accountId=${query.accountId}` : ''
              }${
                query?.status === ProposalsFeedStatuses.VoteNeeded
                  ? '&filter=permissions.canApprove||$eq||true&filter=permissions.canReject||$eq||true&voted=false'
                  : ''
              }`;
            }
          }
          break;
        default:
          break;
      }

      return request;
    });

    this.client.interceptors.response.use(response => {
      const responseConfig: CustomAxiosRequestConfig = response.config;

      if (!responseConfig.responseMapper) {
        return response;
      }

      switch (responseConfig.responseMapper.name) {
        case API_MAPPERS.MAP_DAO_DTO_TO_DAO:
          response.data = mapDaoDTOtoDao(response.data);
          break;
        case API_MAPPERS.MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEEDS:
          response.data = {
            ...response.data,
            data: mapDaoFeedItemResponseToDaoFeedItemList(response.data.data),
          };
          break;
        case API_MAPPERS.MAP_DAO_FEED_ITEM_RESPONSE_TO_DAO_FEED:
          response.data = mapDaoFeedItemResponseToDaoFeedItemList(
            response.data
          );
          break;
        case API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSALS:
          response.data = response.data.map(mapProposalDTOToProposal);
          break;
        case API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSAL:
          response.data = mapProposalDTOToProposal(response.data);
          break;
        case API_MAPPERS.MAP_SEARCH_RESULTS_DTO_TO_DATA_OBJECT:
          response.data = mapSearchResultsDTOToDataObject(
            responseConfig.params.query,
            {
              daos: response.data?.daos?.data,
              proposals: response.data?.proposals?.data,
              members: response.data?.members?.data,
            }
          );
          break;
        case API_MAPPERS.MAP_PROPOSAL_FEED_ITEM_RESPONSE_TO_PROPOSAL_FEED_ITEM:
          response.data = {
            ...response.data,
            data: response.data.data.map(
              mapProposalFeedItemResponseToProposalFeedItem
            ),
          };
          break;
        case API_MAPPERS.MAP_SUBSCRIPTIONS_DTOS_TO_DAO_SUBSCRIPTIONS:
          response.data = mapSubscriptionsDTOsToDaoSubscriptions(response.data);
          break;
        case API_MAPPERS.MAP_TOKENS_DTO_TO_TOKENS:
          response.data = mapTokensDTOToTokens(response.data.data);
          break;
        case API_MAPPERS.MAP_TOKENS_DTO_TO_TOKEN:
          response.data = mapTokensDTOToTokens(response.data);
          break;
        case API_MAPPERS.MAP_NFT_TOKEN_RESPONSE_TO_NFT_TOKEN:
          response.data = mapNftTokenResponseToNftToken(response.data.data);
          break;
        case API_MAPPERS.MAP_RECEIPTS_BY_TOKEN_RESPONSE:
          response.data = mapReceiptsByTokenResponse(
            responseConfig?.responseMapper?.params?.accountId || '',
            responseConfig?.responseMapper?.params?.tokenId || '',
            response.data
          );
          break;
        case API_MAPPERS.MAP_RECEIPTS_RESPONSE:
          response.data = mapReceiptsResponse(
            responseConfig?.responseMapper?.params?.accountId || '',
            response.data
          );
          break;
        case API_MAPPERS.MAP_PROPOSALS_OVERTIME_TO_CHART_DATA:
          response.data = mapProposalsOvertimeToChartData(response.data);
          break;
        case API_MAPPERS.MAP_OVERTIME_TO_CHART_DATA:
          response.data = mapOvertimeToChartData(response.data);
          break;
        default:
          break;
      }

      return response;
    });
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<R> {
    return this.client.get<T, R>(url, config);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  post<T, R>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.client.post<T, R>(url, data, config);
  }

  patch<T, R>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.patch<T, R>(url, data, config);
  }

  delete<T, R>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.delete<T, R>(url, {
      ...config,
      data,
    });
  }
}

export const httpService = new HttpService();
