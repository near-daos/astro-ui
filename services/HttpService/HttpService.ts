/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  RequestQueryBuilder,
  SConditionAND,
  SFields,
} from '@nestjsx/crud-request';
import omit from 'lodash/omit';

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
  mapProposalToProposers,
} from 'services/sputnik/mappers';
import { mapNftTokenResponseToNftToken } from 'services/sputnik/mappers/nfts';

import {
  API_MAPPERS,
  ApiMappers,
  API_QUERIES,
  ApiQueries,
  LIST_LIMIT_DEFAULT,
} from 'services/sputnik/constants';
import { mapDraftToProposalDraft } from 'services/DraftsService/mappers';
import { appConfig } from 'config';
import {
  ProposalCategories,
  ProposalsFeedStatuses,
  ProposalType,
  // ProposalVariant,
} from 'types/proposal';
import { DaoFeedItem } from 'types/dao';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';

interface Mapper {
  name: ApiMappers | string;
  params?: { [key: string]: any };
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
      baseURL: appConfig.API_URL,
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

            if (daoId) {
              queryBuilder.setFilter({
                field: 'daoId',
                operator: '$eq',
                value: daoId,
              });
            }

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

            const queryString = new URLSearchParams();

            queryString.append('dao', daoIds.join(','));
            queryString.append('active', 'true');

            queryString.append('limit', limit || `${LIST_LIMIT_DEFAULT}`);
            queryString.append('offset', offset || `${0}`);
            queryString.append('orderBy', 'createdAt');
            queryString.append('order', 'DESC');

            request.url = `/proposals?${queryString}`;
          }
          break;
        case API_QUERIES.GET_USER_PROPOSALS:
          {
            const { accountId } = requestCustom.queryRequest?.params || {};

            const queryString = new URLSearchParams();

            queryString.append('proposer', accountId);

            queryString.append('limit', `${LIST_LIMIT_DEFAULT}`);
            queryString.append('offset', `${0}`);
            queryString.append('orderBy', 'createdAt');
            queryString.append('order', 'DESC');

            request.url = `/proposals?${queryString}`;
          }
          break;
        case API_QUERIES.GET_USER_PROPOSALS_BY_PROPOSER: {
          const { proposers, accountId, daoId } =
            requestCustom.queryRequest?.params || {};

          const queryString = new URLSearchParams();

          queryString.append('dao', daoId);
          queryString.append('proposer', `${proposers}`);

          queryString.append('limit', `${LIST_LIMIT_DEFAULT}`);
          queryString.append('offset', `${0}`);
          queryString.append('orderBy', 'createdAt');
          queryString.append('order', 'DESC');

          request.url = `/proposals?${queryString}${
            accountId ? `&accountId=${accountId}` : ''
          }`;
          break;
        }
        case API_QUERIES.GET_PROPOSAL_BY_ID:
          {
            const { proposalId, accountId } =
              requestCustom.queryRequest?.params || {};

            const queryString = new URLSearchParams();

            queryString.append('id', proposalId);

            request.url = `/proposals/${proposalId}${
              accountId ? `?accountId=${accountId}` : ''
            }`;
          }
          break;
        case API_QUERIES.FIND_POLICY_AFFECTS_PROPOSALS:
          {
            const { daoId } = requestCustom.queryRequest?.params || {};

            const queryString = new URLSearchParams();

            queryString.append('dao', daoId);

            queryString.append('active', 'true');

            queryString.append(
              'type',
              `${ProposalType.ChangeConfig},${ProposalType.ChangePolicy}`
            );

            queryString.append('limit', `${LIST_LIMIT_DEFAULT}`);
            queryString.append('offset', `${0}`);
            queryString.append('orderBy', 'createdAt');
            queryString.append('order', 'DESC');

            request.url = `/proposals?${queryString}`;
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
                $gt: 'now',
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
            const queryString = new URLSearchParams();

            queryString.append('dao', daoId);
            queryString.append('type', ProposalType.Vote);

            queryString.append('limit', limit ?? LIST_LIMIT_DEFAULT);
            queryString.append('offset', offset ?? 0);
            queryString.append('orderBy', 'createdAt');
            queryString.append('order', 'DESC');

            request.url = `/proposals?${queryString}`;
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

            if (daoId) {
              queryBuilder.setFilter({
                field: 'daoId',
                operator: '$eq',
                value: daoId,
              });
            }

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
        case API_QUERIES.GET_TEMPLATES_BY_SMART_CONTRACT: {
          const { query, smartContractAddress, templateId } =
            requestCustom.queryRequest?.params || {};

          const queryString = RequestQueryBuilder.create();

          queryString.setFilter({
            field: 'config',
            operator: '$contL',
            value: smartContractAddress,
          });

          queryString.setFilter({
            field: 'id',
            operator: '$ne',
            value: templateId,
          });

          queryString
            .setLimit(query?.limit ?? 1000)
            .setOffset(query?.offset ?? 0)
            .query();

          request.url = `/proposals/templates?${queryString.queryString}`;

          break;
        }
        case API_QUERIES.GET_SHARED_PROPOSAL_TEMPLATES: {
          const { query, templateId } =
            requestCustom.queryRequest?.params || {};

          const queryString = RequestQueryBuilder.create();

          const search: SFields | SConditionAND = {
            $and: [],
          };

          // search
          if (query?.searchInput) {
            search.$and?.push({
              name: {
                $contL: query.searchInput,
              },
            });
          }

          if (search.$and?.length) {
            queryString.search(search);
          }

          if (templateId) {
            queryString.setFilter({
              field: 'id',
              operator: '$eq',
              value: templateId,
            });
          }

          queryString
            .setLimit(query?.limit ?? 1000)
            .setOffset(query?.offset ?? 0)
            .query();

          request.url = `/proposals/templates?${queryString.queryString}&join=daos||id`;
          request.params = { sort: query?.sort };

          break;
        }
        case API_QUERIES.GET_PROPOSALS_LIST_BY_ACCOUNT_ID: {
          const { query, accountId } = requestCustom.queryRequest?.params || {};

          const queryString = RequestQueryBuilder.create();

          const search: SFields | SConditionAND = {
            $and: [],
          };

          // ids in the list
          if (query.ids) {
            search.$and?.push({
              id: {
                $inL: query.ids,
              },
            });
          }

          // specific DAO
          if (query.daoId) {
            search.$and?.push({
              daoId: {
                $eq: query.daoId,
              },
            });
          }

          // Proposers
          if (query?.proposers) {
            search.$and?.push({
              proposer: {
                $in: query.proposers.split(','),
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
                $gt: 'now',
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
                    $lt: 'now',
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

          if (query.category === ProposalCategories.FunctionCalls) {
            search.$and?.push({
              kind: {
                $cont: ProposalType.FunctionCall,
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
            }${query.accountId ? `&accountId=${query.accountId}` : ''}${
              query?.status === ProposalsFeedStatuses.VoteNeeded
                ? '&filter=permissions.canApprove||$eq||true&filter=permissions.canReject||$eq||true&voted=false'
                : ''
            }`;
          } else {
            request.url = `/proposals?${queryString.queryString}${
              query.accountId ? `&accountId=${query.accountId}` : ''
            }${
              query?.status === ProposalsFeedStatuses.VoteNeeded
                ? '&filter=permissions.canApprove||$eq||true&filter=permissions.canReject||$eq||true&voted=false'
                : ''
            }`;
          }

          break;
        }
        case API_QUERIES.GET_PROPOSALS_LIST: {
          const { query } = requestCustom.queryRequest?.params || {};

          const queryString = new URLSearchParams();

          // ids in the list
          if (query.ids) {
            queryString.append('id', query.ids.join(','));
          }

          // specific DAO
          if (query.daoId) {
            queryString.append('dao', query.daoId);
          }

          // Proposers
          if (query?.proposers) {
            queryString.append('proposer', query.proposers);
          }

          // Statuses
          if (query?.status === ProposalsFeedStatuses.VoteNeeded) {
            queryString.append('active', 'true');
            queryString.append('voted', 'false');
          }

          if (query?.status === ProposalsFeedStatuses.Active) {
            queryString.append('active', 'true');
          }

          if (query?.status === ProposalsFeedStatuses.Approved) {
            queryString.append('status', 'Approved');
          }

          if (query?.status === ProposalsFeedStatuses.Failed) {
            queryString.append('failed', 'true');
          }

          // Categories
          if (query.category === ProposalCategories.Polls) {
            queryString.append('type', ProposalType.Vote);
          }

          if (query.category === ProposalCategories.Governance) {
            queryString.append(
              'type',
              `${ProposalType.ChangeConfig},${ProposalType.ChangePolicy}`
            );
          }

          if (query.category === ProposalCategories.Bounties) {
            queryString.append(
              'type',
              `${ProposalType.AddBounty},${ProposalType.BountyDone}`
            );
          }

          if (query.category === ProposalCategories.Financial) {
            queryString.append('type', `${ProposalType.Transfer}`);
          }

          if (query.category === ProposalCategories.FunctionCalls) {
            queryString.append('type', `${ProposalType.FunctionCall}`);
          }

          if (query.category === ProposalCategories.Members) {
            queryString.append(
              'type',
              `${ProposalType.AddMemberToRole},${ProposalType.RemoveMemberFromRole}`
            );
          }

          // DaosIds
          if (query.daosIdsFilter) {
            queryString.append('dao', query.daosIdsFilter.join(','));
          }

          queryString.append('limit', query.limit ?? LIST_LIMIT_DEFAULT);
          queryString.append('offset', query.offset ?? 0);
          queryString.append('orderBy', 'createdAt');
          queryString.append('order', 'DESC');

          request.url = `/proposals?${queryString}${
            query.accountId ? `&accountId=${query.accountId}` : ''
          }${
            query?.status === ProposalsFeedStatuses.VoteNeeded
              ? '&filter=permissions.canApprove||$eq||true&filter=permissions.canReject||$eq||true&voted=false'
              : ''
          }`;

          break;
        }
        case API_QUERIES.FIND_TRANSFER_PROPOSALS: {
          const { daoId, targetDaoId } =
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
                  $cont: targetDaoId,
                },
              },
              {
                kind: {
                  $cont: ProposalType.Transfer,
                },
              },
              {
                status: {
                  $eq: 'InProgress',
                },
              },
            ],
          };

          queryString.search(search);

          queryString
            .setLimit(200)
            .setOffset(0)
            .sortBy({
              field: 'createdAt',
              order: 'DESC',
            })
            .query();

          request.url = `/proposals?${queryString.queryString}`;

          break;
        }

        case API_QUERIES.UPDATE_NOTIFICATION:
        case API_QUERIES.READ_ALL_NOTIFICATIONS:
        case API_QUERIES.ARCHIVE_ALL_NOTIFICATIONS:
        case API_QUERIES.UPDATE_NOTIFICATION_SETTINGS:
        case API_QUERIES.SEND_CONTACT:
        case API_QUERIES.SEND_VERIFICATION:
        case API_QUERIES.VERIFY:
        case API_QUERIES.TOGGLE_BOUNTY_CONTEXTS:
        case API_QUERIES.SHOW_BOUNTIES:
        case API_QUERIES.UPDATE_DAO_SETTINGS:
        case API_QUERIES.SAVE_PROPOSAL_TEMPLATE:
        case API_QUERIES.CLONE_PROPOSAL_TEMPLATE:
        case API_QUERIES.UPDATE_PROPOSAL_TEMPLATE:
        case API_QUERIES.DELETE_PROPOSAL_TEMPLATE:
        case API_QUERIES.UPDATE_ACCOUNT_SUBSCRIPTION:
        case API_QUERIES.DELETE_ACCOUNT_SUBSCRIPTION:
        case API_QUERIES.DELETE_COMMENT:
        case API_QUERIES.REPORT_COMMENT:
        case API_QUERIES.SEND_COMMENT:
        case API_QUERIES.ADD_AUTHORIZATION: {
          const { accountId, publicKey, signature } = request.data;

          const buff = Buffer.from(`${accountId}|${publicKey}|${signature}`);

          request.data = omit(request.data, [
            'accountId',
            'publicKey',
            'signature',
          ]);

          request.headers = {
            'X-Authorization': `Bearer ${buff.toString('base64')}`,
          };
          break;
        }
        case API_QUERIES.OPEN_SEARCH_AUTHORIZATION: {
          const { username, password } = requestCustom.queryRequest.params as {
            username: string;
            password: string;
          };

          const buff = Buffer.from(`${username}:${password}`);

          request.headers = {
            Authorization: `Basic ${buff.toString('base64')}`,
          };
          break;
        }
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
          response.data = response.data.data.map(mapProposalDTOToProposal);
          break;
        case API_MAPPERS.MAP_PROPOSAL_DTO_TO_PROPOSAL:
          response.data = mapProposalDTOToProposal(response.data);
          break;
        case API_MAPPERS.MAP_PROPOSAL_TO_PROPOSER:
          response.data = mapProposalToProposers(response.data);
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
          response.data = response.data.data
            ? {
                ...response.data,
                data: response.data.data.map(
                  mapProposalFeedItemResponseToProposalFeedItem
                ),
              }
            : mapProposalFeedItemResponseToProposalFeedItem(response.data);
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
        case API_MAPPERS.MAP_DRAFT_TO_PROPOSAL_DRAFT:
          response.data = mapDraftToProposalDraft(
            response.data,
            responseConfig?.responseMapper?.params?.dao
          );
          break;
        case API_MAPPERS.MAP_OPEN_SEARCH_RESPONSE_TO_DAOS: {
          response.data = mapOpenSearchResponseToSearchResult(
            'daos',
            SearchResponseIndex.DAO,
            response.data
          );
          break;
        }
        case API_MAPPERS.MAP_OPEN_SEARCH_RESPONSE_TO_BOUNTIES: {
          response.data = mapOpenSearchResponseToSearchResult(
            'bounty',
            SearchResponseIndex.BOUNTY,
            response.data
          );
          break;
        }
        case API_MAPPERS.MAP_OPEN_SEARCH_RESPONSE_TO_PROPOSALS: {
          response.data = mapOpenSearchResponseToSearchResult(
            'proposal',
            SearchResponseIndex.PROPOSAL,
            response.data
          );
          break;
        }
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

  post<T, R>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<R> {
    return this.client.post<T, R>(url, data, config);
  }

  patch<T, R>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<R> {
    return this.client.patch<T, R>(url, data, config);
  }

  delete<T, R>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<R> {
    return this.client.delete<T, R>(url, {
      ...config,
      data,
    });
  }
}

export const httpService = new HttpService();
