import BN from 'bn.js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  ConnectedWalletAccount,
  keyStores,
  Near,
  transactions,
  utils,
} from 'near-api-js';

import { CreateDaoInput } from 'types/dao';

import { CreateProposalParams, Transfer, VoteAction } from 'types/proposal';

import { formatGasValue } from 'utils/format';

import { FunctionCallOptions } from 'near-api-js/lib/account';
import { mapCreateDaoParamsToContractArgs } from 'services/sputnik/mappers';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';
import { Config, WalletType } from 'types/config';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/services/SputnikWalletService';
import { NearConfig } from 'config/near';
import {
  DaoService,
  WalletService,
  Transaction,
} from 'services/sputnik/SputnikNearService/services/types';
import { SenderWalletService } from 'services/sputnik/SputnikNearService/services/SenderWalletService';
import { configService } from 'services/ConfigService';
import { ACCOUNT_COOKIE, DEFAULT_OPTIONS } from 'constants/cookies';
import { CookieService } from 'services/CookieService';

export const GAS_VALUE = new BN('300000000000000');
export const FINALIZE_PROPOSAL_GAS_VALUE = new BN('150000000000000');

export class SputnikNearService implements WalletService, DaoService {
  private walletService: WalletService;

  private readonly nearConfig: NearConfig;

  private appConfig: Config;

  constructor(walletService: WalletService) {
    this.walletService = walletService;
    this.nearConfig = configService.get().nearConfig;
    this.appConfig = configService.get().appConfig;
  }

  sendMoney(receiverId: string, amount: BN): Promise<FinalExecutionOutcome> {
    return this.walletService.sendMoney(receiverId, amount);
  }

  getWalletType(): WalletType {
    return this.walletService.getWalletType();
  }

  isSignedIn(): boolean {
    return this.walletService.isSignedIn();
  }

  getAccount(): ConnectedWalletAccount {
    return this.walletService.getAccount();
  }

  functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome> {
    return this.walletService.functionCall(props);
  }

  getPublicKey(): Promise<string | null> {
    return this.walletService.getPublicKey();
  }

  getSignature(): Promise<string | null> {
    return this.walletService.getSignature();
  }

  sendTransactions(txs: Transaction[]): Promise<FinalExecutionOutcome[]> {
    return this.walletService.sendTransactions(txs);
  }

  public async signIn(contractId: string): Promise<void> {
    await this.walletService.signIn(contractId);

    const accountCookieOptions = this.appConfig.APP_DOMAIN
      ? { ...DEFAULT_OPTIONS, domain: this.appConfig.APP_DOMAIN }
      : DEFAULT_OPTIONS;

    CookieService.set(
      ACCOUNT_COOKIE,
      this.getAccountId(),
      accountCookieOptions
    );
  }

  public async logout(): Promise<void> {
    this.walletService.logout();
    window.localStorage.removeItem('selectedWallet');
  }

  public getAccountId(): string {
    return this.walletService.getAccountId();
  }

  public async switchWallet(walletType: WalletType): Promise<void> {
    switch (walletType) {
      case WalletType.NEAR: {
        this.walletService = new SputnikWalletService(this.nearConfig);
        await this.walletService.signIn(this.nearConfig.contractName);
        break;
      }

      case WalletType.SENDER: {
        this.walletService = new SenderWalletService(window.near);
        await this.walletService.signIn(this.nearConfig.contractName);
        break;
      }

      default: {
        this.walletService = new SputnikWalletService(this.nearConfig);
      }
    }
  }

  public async createDao(params: CreateDaoInput): Promise<void> {
    const args = mapCreateDaoParamsToContractArgs(params);

    const amount = new BN(
      utils.format.parseNearAmount(params.amountToTransfer) || '0'
    );

    await this.walletService.functionCall({
      contractId: this.nearConfig.contractName,
      methodName: 'create',
      args: {
        name: params.name,
        args,
      },
      gas: formatGasValue(params.gas),
      attachedDeposit: amount,
    });
  }

  public async addProposal(
    params: CreateProposalParams
  ): Promise<FinalExecutionOutcome> {
    const { daoId, description, kind, data, bond, gas } = params;

    const kindData = data
      ? {
          [kind]: data,
        }
      : kind;

    return this.walletService.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description,
          kind: kindData,
        },
      },
      gas: formatGasValue(gas ?? DEFAULT_PROPOSAL_GAS),
      attachedDeposit: new BN(bond),
    });
  }

  public async claimBounty(
    daoId: string,
    args: {
      bountyId: number;
      deadline: string;
      bountyBond: string;
      gas?: string | number;
      tokenId?: string;
    }
  ): Promise<FinalExecutionOutcome[]> {
    const accountId = this.getAccountId();
    const { bountyId: id, deadline, bountyBond, gas, tokenId } = args;

    const storageDepositTransactionAction = tokenId
      ? {
          receiverId: tokenId,
          actions: [
            transactions.functionCall(
              'storage_deposit',
              {
                account_id: accountId,
                registration_only: true,
              },
              GAS_VALUE,
              // 0.1 NEAR, minimal value
              new BN('100000000000000000000000')
            ),
          ],
        }
      : null;

    const claimAction = {
      receiverId: daoId,
      actions: [
        transactions.functionCall(
          'bounty_claim',
          {
            id,
            deadline,
          },
          gas ? formatGasValue(gas) : GAS_VALUE,
          new BN(bountyBond)
        ),
      ],
    };

    const trx = storageDepositTransactionAction
      ? [storageDepositTransactionAction, claimAction]
      : [claimAction];

    return this.walletService.sendTransactions(trx);
  }

  public async unclaimBounty(
    daoId: string,
    bountyId: number,
    gas?: string | number
  ): Promise<FinalExecutionOutcome> {
    return this.walletService.functionCall({
      methodName: 'bounty_giveup',
      contractId: daoId,
      args: {
        id: bountyId,
      },
      gas: gas ? formatGasValue(gas) : GAS_VALUE,
    });
  }

  public async finalize(
    contractId: string,
    proposalId: number
  ): Promise<FinalExecutionOutcome> {
    return this.walletService.functionCall({
      methodName: 'act_proposal',
      contractId,
      args: {
        id: proposalId,
        action: 'Finalize',
      },
      gas: FINALIZE_PROPOSAL_GAS_VALUE,
    });
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: VoteAction,
    gas?: string | number
  ): Promise<FinalExecutionOutcome> {
    return this.walletService.functionCall({
      methodName: 'act_proposal',
      contractId: daoId,
      args: {
        id: proposalId,
        action,
      },
      gas: gas ? formatGasValue(gas) : GAS_VALUE,
    });
  }

  public async createTokenTransferProposal(
    proposal: CreateProposalParams
  ): Promise<FinalExecutionOutcome[]> {
    const { bond, daoId, description, kind, data } = proposal;

    const {
      token_id: tokenContract,
      receiver_id: recipient,
    } = data as Transfer;

    const storageDepositTransactionAction = {
      receiverId: tokenContract,
      actions: [
        transactions.functionCall(
          'storage_deposit',
          {
            account_id: recipient,
            registration_only: true,
          },
          GAS_VALUE,
          // 0.1 NEAR, minimal value
          new BN('100000000000000000000000')
        ),
      ],
    };

    const transferTransaction = {
      receiverId: daoId,
      actions: [
        transactions.functionCall(
          'add_proposal',
          {
            proposal: {
              description,
              kind: {
                [kind]: data,
              },
            },
          },
          GAS_VALUE,
          new BN(bond)
        ),
      ],
    };

    const trx = tokenContract
      ? [storageDepositTransactionAction, transferTransaction]
      : [transferTransaction];

    return this.walletService.sendTransactions(trx);
  }

  async nearAccountExist(accountId: string): Promise<boolean> {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();

    const near = new Near({
      ...this.nearConfig,
      keyStore,
    });

    const account = await near.account(accountId);

    try {
      await account.state();

      return true;
    } catch (e) {
      return false;
    }
  }
}
