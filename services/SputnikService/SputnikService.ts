/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  RequestQueryBuilder,
  SConditionAND,
  SFields
} from '@nestjsx/crud-request';
import PromisePool from '@supercharge/promise-pool';
import Big from 'big.js';
import { NearConfig, nearConfig } from 'config';
import omit from 'lodash/omit';
import { Contract, keyStores, Near } from 'near-api-js';
import { CookieService } from 'services/CookieService';

import { HttpService, httpService } from 'services/HttpService';
import {
  DaoDTO,
  ProposalDTO,
  SearchResponse,
  GetDAOsResponse,
  GetProposalsResponse,
  mapDaoDTOtoDao,
  mapTokensDTOToTokens,
  mapDaoDTOListToDaoList,
  mapProposalDTOToProposal,
  mapSearchResultsDTOToDataObject,
  mapReceiptsResponse,
  ReceiptDTO
} from 'services/sputnik/mappers';

import { BountiesResponse, BountyResponse } from 'types/bounties';

import { CreateDaoInput, DAO } from 'types/dao';
import { CreateProposalParams, Proposal, ProposalType } from 'types/proposal';
import { SearchResultsData } from 'types/search';
import {
  ProposalFilterOptions,
  ProposalFilterStatusOptions
} from 'features/member-home/types';

import {
  CreateTokenParams,
  GetTokensResponse,
  NftToken,
  NftTokenResponse,
  Token,
  TokenResponse
} from 'types/token';
import { Receipt } from 'types/transaction';

import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikWalletService } from './SputnikWalletService';
import { SputnikDaoService } from './SputnikDaoService';

class SputnikService {
  private readonly config: NearConfig;

  private readonly httpService: HttpService = httpService;

  private sputnikWalletService!: SputnikWalletService;

  private sputnikDaoService!: SputnikDaoService;

  private factoryTokenContract!: Contract & any;

  private near!: Near;

  constructor(config: NearConfig) {
    this.config = config;
  }

  public init(): void {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    this.near = new Near({
      ...this.config,
      keyStore
    });

    this.sputnikWalletService = new SputnikWalletService(this.near);
    this.sputnikWalletService.init();

    const account = this.sputnikWalletService.getAccount();

    this.sputnikDaoService = new SputnikDaoService(
      this.config.contractName,
      this.sputnikWalletService
    );

    this.factoryTokenContract = new Contract(
      account,
      this.config.tokenContractName,
      {
        viewMethods: [
          'get_required_deposit',
          'get_number_of_tokens',
          'get_tokens',
          'get_token'
        ],
        changeMethods: ['create_token', 'storage_deposit']
      }
    );
  }

  public isAuthorized(): boolean {
    if (process.browser && this.sputnikWalletService) {
      return !!this.sputnikWalletService.getAccountId();
    }

    return !!CookieService.get(ACCOUNT_COOKIE);
  }

  public async login(): Promise<void> {
    await this.sputnikWalletService.login();
  }

  public async logout(): Promise<void> {
    this.sputnikWalletService.logout();
  }

  public getAccountId(): string {
    if (!process.browser) {
      return CookieService.get(ACCOUNT_COOKIE);
    }

    if (!this.sputnikWalletService && process.browser) {
      this.init();
    }

    return this.sputnikWalletService.getAccountId();
  }

  async computeRequiredDeposit(args: unknown) {
    return Big(
      await this.factoryTokenContract.get_required_deposit({
        args,
        account_id: this.getAccountId()
      })
    );
  }

  // for testing purpose
  public async listTokens() {
    const tokensCount = await this.factoryTokenContract.get_number_of_tokens();
    const chunkSize = 5;
    const chunkCount =
      (tokensCount - (tokensCount % chunkSize)) / chunkSize + 1;

    const { results, errors } = await PromisePool.withConcurrency(1)
      .for([...Array(chunkCount).keys()])
      .process(async (offset: number) =>
        this.factoryTokenContract.get_tokens({
          from_index: offset * chunkSize,
          limit: chunkSize
        })
      );

    // eslint-disable-next-line no-console
    console.log(results, errors);
  }

  public async createToken(params: CreateTokenParams): Promise<any> {
    const args = {
      owner_id: this.getAccountId(),
      total_supply: '1000000000000000000000',
      metadata: {
        spec: 'ft-1.0.0',
        decimals: 18,
        name: params.name,
        symbol: params.symbol,
        icon: params.icon
      }
    };

    const TGas = Big(10).pow(12);
    const BoatOfGas = Big(200).mul(TGas);

    await this.factoryTokenContract.create_token(
      { args },
      BoatOfGas.toFixed(0)
    );
  }

  public async createDao(params: CreateDaoInput): Promise<boolean> {
    try {
      await this.sputnikDaoService.create(params);

      return true;
    } catch (err) {
      console.error(err);
    }

    return false;
  }

  public async createProposal(params: CreateProposalParams): Promise<any> {
    return this.sputnikDaoService.addProposal(params);
  }

  public async registerUserToToken(tokenId: string) {
    return this.sputnikDaoService.registerToToken(tokenId);
  }

  public async claimBounty(
    daoId: string,
    args: { bountyId: number; deadline: string; bountyBond: string }
  ) {
    await this.sputnikDaoService.claimBounty({ daoId, ...args });
  }

  public async unclaimBounty(daoId: string, bountyId: string) {
    await this.sputnikDaoService.unclaimBounty(daoId, bountyId);
  }

  public async finalize(contractId: string, proposalId: number): Promise<void> {
    return this.sputnikDaoService.finalize(contractId, proposalId);
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: 'VoteApprove' | 'VoteRemove' | 'VoteReject'
  ): Promise<void> {
    return this.sputnikDaoService.vote(daoId, proposalId, action);
  }

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
        createdBy: params?.createdBy
      }
    });

    return {
      data: mapDaoDTOListToDaoList(data.data),
      total: data.total
    };
  }

  public async getDaoById(daoId: string): Promise<DAO | null> {
    try {
      const { data: dao } = await this.httpService.get<DaoDTO>(
        `/daos/${daoId}`
      );

      return mapDaoDTOtoDao(dao);
    } catch (error) {
      if ([400, 404].includes(error.response.status)) {
        return null;
      }

      throw error;
    }
  }

  public async search(params: {
    offset?: number;
    limit?: number;
    sort?: string;
    query: string;
  }): Promise<SearchResultsData | null> {
    const result = await this.httpService.get<SearchResponse>('/search', {
      params: {
        query: params.query
      }
    });

    return mapSearchResultsDTOToDataObject(params.query, {
      daos: (result.data as SearchResponse)?.daos?.data as DaoDTO[],
      proposals: (result.data as SearchResponse)?.proposals
        ?.data as ProposalDTO[],
      members: []
    });
  }

  public async getAccountDaos(accountId: string): Promise<DAO[]> {
    const { data } = await this.httpService.get<DaoDTO[]>(
      `/daos/account-daos/${accountId}`
    );

    return mapDaoDTOListToDaoList(data);
  }

  public async getBountiesDone(daoId: string): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create()
      .setFilter({
        field: 'daoId',
        operator: '$eq',
        value: daoId
      })
      .setFilter({
        field: 'kind',
        operator: '$cont',
        value: ProposalType.BountyDone
      })
      .setFilter({
        field: 'status',
        operator: '$eq',
        value: 'Approved'
      })
      .setLimit(500)
      .setOffset(0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC'
      })
      .query();

    const { data: bounties } = await this.httpService.get<GetProposalsResponse>(
      `/proposals?${queryString}`
    );

    return bounties.data.map(mapProposalDTOToProposal);
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
        value: daoIds
      })
      .setFilter({
        field: 'status',
        operator: '$eq',
        value: 'InProgress'
      })
      .setLimit(limit)
      .setOffset(offset)
      .sortBy({
        field: 'createdAt',
        order: 'DESC'
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
        value: accountId
      })
      .setLimit(500)
      .setOffset(0)
      .query();

    const response = await this.httpService.get<GetProposalsResponse>(
      `/proposals?${queryString}`
    );

    return response.data.data;
  }

  public async getFilteredProposals(
    filter: {
      daoViewFilter?: string | null;
      daoFilter?: 'All DAOs' | 'My DAOs' | 'Following DAOs' | null;
      proposalFilter?: ProposalFilterOptions;
      status?: ProposalFilterStatusOptions;
      daosIdsFilter?: string[];
    },
    accountId?: string
  ): Promise<Proposal[]> {
    const queryString = RequestQueryBuilder.create();

    const search: SFields | SConditionAND = {
      $and: []
    };

    // specific DAO
    if (filter.daoViewFilter) {
      search.$and?.push({
        daoId: {
          $eq: `${filter.daoViewFilter}.${nearConfig.contractName}`
        }
      });
    } else if (filter.daoFilter === 'My DAOs' && accountId) {
      const accountDaos = await this.getAccountDaos(accountId);

      if (accountDaos.length) {
        search.$and?.push({
          daoId: {
            $in: accountDaos.map(item => item.id)
          }
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
          $eq: 'InProgress'
        }
      });
    } else if (filter.status && filter.status === 'Approved') {
      search.$and?.push({
        status: {
          $eq: 'Approved'
        }
      });
    } else if (filter.status && filter.status === 'Failed') {
      // Fetch failed including InProgress items and then do additional filtering for Expired
      search.$and?.push({
        status: {
          $in: ['Rejected', 'Expired', 'Moved', 'InProgress']
        }
      });
    }

    // Kinds
    if (filter.proposalFilter === 'Polls') {
      search.$and?.push({
        kind: {
          $cont: ProposalType.Vote,
          $excl: ProposalType.ChangePolicy
        }
      });
    }

    if (filter.proposalFilter === 'Governance') {
      search.$and?.push({
        $or: [
          {
            kind: {
              $cont: ProposalType.ChangeConfig
            }
          },
          {
            kind: {
              $cont: ProposalType.ChangePolicy
            }
          }
        ]
      });
    }

    if (filter.proposalFilter === 'Financial') {
      search.$and?.push({
        kind: {
          $cont: ProposalType.Transfer
        }
      });
    }

    if (filter.proposalFilter === 'Groups') {
      search.$and?.push({
        $or: [
          {
            kind: {
              $cont: ProposalType.AddMemberToRole
            }
          },
          {
            kind: {
              $cont: ProposalType.RemoveMemberFromRole
            }
          }
        ]
      });
    }

    queryString.search(search);

    // DaosIds
    if (filter.daosIdsFilter) {
      queryString.setFilter({
        field: 'daoId',
        operator: '$in',
        value: filter.daosIdsFilter
      });
    }

    queryString
      .setLimit(1000)
      .setOffset(0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC'
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
      limit
    };

    const { data: proposals } = await this.httpService.get<
      GetProposalsResponse
    >('/proposals', {
      params: daoId ? params : omit(params, 'filter')
    });

    return proposals.data.map(mapProposalDTOToProposal);
  }

  public async getAccountReceipts(accountId?: string): Promise<Receipt[]> {
    const { data } = await this.httpService.get<ReceiptDTO[]>(
      `/transactions/receipts/account-receipts/${accountId}`
    );

    return mapReceiptsResponse(accountId as string, data);
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
            $eq: daoId
          }
        },
        {
          kind: {
            $cont: ProposalType.Vote,
            $excl: ProposalType.ChangePolicy
          }
        }
      ]
    };

    queryString.search(search);

    queryString
      .setLimit(limit ?? 1000)
      .setOffset(offset ?? 0)
      .sortBy({
        field: 'createdAt',
        order: 'DESC'
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
  }): Promise<BountyResponse[]> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<BountiesResponse>('/bounties', {
      params: {
        offset,
        limit,
        sort
      }
    });

    return data.data;
  }

  public async getBountiesByDaoId(
    daoId: string,
    params?: {
      offset?: number;
      limit?: number;
      sort?: string;
    }
  ): Promise<BountyResponse[]> {
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 50;
    const sort = params?.sort ?? 'createdAt,DESC';

    const { data } = await this.httpService.get<BountiesResponse>('/bounties', {
      params: {
        filter: `daoId||$eq||${daoId}`,
        offset,
        limit,
        sort
      }
    });

    return data.data;
  }

  public async getAccountNFTs(accountId: string): Promise<NftToken[]> {
    const { data } = await this.httpService.get<NftTokenResponse[]>(
      `/tokens/nfts/account-nfts/${accountId}`
    );

    return data.map(response => ({
      id: response.id,
      uri: response.baseUri
        ? `${response.baseUri}/${response.metadata.media}`
        : `https://cloudflare-ipfs.com/ipfs/${response.metadata.media}`,
      description: response.metadata.description,
      title: response.metadata.title
    }));
  }

  public async getAllTokens(): Promise<Token[]> {
    const { data } = await this.httpService.get<TokenResponse[]>('/tokens');

    return mapTokensDTOToTokens(data);
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
        sort
      }
    });

    return mapTokensDTOToTokens(data.data);
  }

  public async nearAccountExist(accountId: string): Promise<boolean> {
    const account = await this.near.account(accountId);

    try {
      await account.state();

      return true;
    } catch (e) {
      return false;
    }
  }

  public async getAccountTokens(accountId: string): Promise<Token[]> {
    const { data } = await this.httpService.get<TokenResponse[]>(
      `/tokens/account-tokens/${accountId}`
    );

    return mapTokensDTOToTokens(data);
  }
}

const nearService = new SputnikService(nearConfig);

export default nearService;
