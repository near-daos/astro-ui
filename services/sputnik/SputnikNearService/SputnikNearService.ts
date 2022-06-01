import BN from 'bn.js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  ConnectedWalletAccount,
  KeyPair,
  keyStores,
  Near,
  transactions,
  utils,
} from 'near-api-js';

import { CreateDaoCustomInput, CreateDaoInput } from 'types/dao';

import { CreateProposalParams, Transfer, VoteAction } from 'types/proposal';

import { formatGasValue } from 'utils/format';

import { FunctionCallOptions } from 'near-api-js/lib/account';
import { mapCreateDaoParamsToContractArgs } from 'services/sputnik/mappers';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';
import { Config, WalletType } from 'types/config';
import { NearConfig } from 'config/near';
import {
  DaoService,
  Transaction,
  WalletService,
} from 'services/sputnik/SputnikNearService/services/types';
import { configService } from 'services/ConfigService';
import { CreateDaoParams } from 'services/sputnik/types';
import { PublicKey } from 'near-api-js/lib/utils';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { FunctionCallPermissionView } from 'near-api-js/lib/providers/provider';
import { AllowanceKey } from 'services/sputnik/SputnikNearService/types';

export const GAS_VALUE = new BN('300000000000000');
export const FINALIZE_PROPOSAL_GAS_VALUE = new BN('150000000000000');
const USN_TOKEN_CONTRACTS = ['usn', 'usdn.testnet'];

export class SputnikNearService implements DaoService {
  private walletService: WalletService;

  private readonly nearConfig: NearConfig;

  private appConfig: Config;

  constructor(currentWallet: WalletService) {
    this.walletService = currentWallet;
    this.nearConfig = configService.get().nearConfig;
    this.appConfig = configService.get().appConfig;
  }

  sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]> {
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

  functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome[]> {
    return this.walletService.functionCall(props);
  }

  async getPublicKey(): Promise<string | null> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    return this.walletService.getPublicKey();
  }

  async getSignature(): Promise<string | null> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    return this.walletService.getSignature();
  }

  sendTransactions(txs: Transaction[]): Promise<FinalExecutionOutcome[]> {
    return this.walletService.sendTransactions(txs);
  }

  public async signIn(contractId: string): Promise<boolean> {
    return this.walletService.signIn(contractId);
  }

  public getAccountId(): string {
    return this.walletService.getAccountId();
  }

  public async createDao(
    params: CreateDaoInput | CreateDaoCustomInput
  ): Promise<void> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    function isCreateDaoParams(
      _params: CreateDaoParams | CreateDaoCustomInput
    ): _params is CreateDaoParams {
      return (_params as CreateDaoParams).policy !== undefined;
    }

    const args = isCreateDaoParams(params)
      ? mapCreateDaoParamsToContractArgs(params)
      : params;

    const amount = new BN(
      utils.format.parseNearAmount(params.amountToTransfer) || '0'
    );

    await this.functionCall({
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
  ): Promise<FinalExecutionOutcome[]> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

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
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    const accountId = this.getAccountId();
    const { bountyId: id, deadline, bountyBond, gas, tokenId } = args;

    let storageDepositTransactionAction;
    let claimAction;

    switch (this.getWalletType()) {
      case WalletType.SENDER: {
        storageDepositTransactionAction = {
          receiverId: tokenId ?? '',
          actions: [
            {
              methodName: 'storage_deposit',
              args: {
                account_id: accountId,
                registration_only: true,
              },
              gas: GAS_VALUE.toString(),
              deposit: '100000000000000000000000',
            },
          ],
        };

        claimAction = {
          receiverId: daoId,
          actions: [
            {
              methodName: 'bounty_claim',
              args: {
                id,
                deadline,
              },
              gas: (gas ? formatGasValue(gas) : GAS_VALUE).toString(),
              deposit: bountyBond,
            },
          ],
        };
        break;
      }
      case WalletType.NEAR:
      default: {
        storageDepositTransactionAction = {
          receiverId: tokenId ?? '',
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
        };

        claimAction = {
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
      }
    }

    const trx = tokenId
      ? [storageDepositTransactionAction, claimAction]
      : [claimAction];

    return this.walletService.sendTransactions(trx);
  }

  public async unclaimBounty(
    daoId: string,
    bountyId: number,
    gas?: string | number
  ): Promise<FinalExecutionOutcome[]> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

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
  ): Promise<FinalExecutionOutcome[]> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

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

  public async getAllowanceKeys(): Promise<AllowanceKey[]> {
    const accessKeys = await this.getAccount().getAccessKeys();

    const permissionPredicate = (permission: FunctionCallPermissionView) => {
      return (
        permission.FunctionCall.receiver_id.endsWith(
          this.nearConfig.contractName
        ) &&
        permission.FunctionCall.allowance !== null &&
        permission.FunctionCall.method_names.includes('act_proposal')
      );
    };

    return accessKeys.reduce<AllowanceKey[]>((acc, accessKey) => {
      if (accessKey.access_key.permission === 'FullAccess') {
        return acc;
      }

      const permission = accessKey.access_key
        .permission as FunctionCallPermissionView;

      if (!permissionPredicate(permission)) {
        return acc;
      }

      acc.push({
        allowance: permission.FunctionCall.allowance,
        daoId: permission.FunctionCall.receiver_id,
        methodNames: permission.FunctionCall.method_names,
      });

      return acc;
    }, []);
  }

  public async requestDaoAllowanceKey(
    daoId: string,
    allowance: string
  ): Promise<FinalExecutionOutcome[]> {
    const accessKey = KeyPair.fromRandom('ed25519');

    const accessKeyTransaction = transactions.functionCallAccessKey(
      daoId,
      ['act_proposal'],
      new BN(parseNearAmount(allowance) ?? 0)
    );

    const result = await this.sendTransactions([
      {
        receiverId: this.getAccountId(),
        actions: [
          transactions.addKey(
            PublicKey.from(accessKey.getPublicKey()),
            accessKeyTransaction
          ),
        ],
      },
    ]);

    await this.walletService
      .getKeyStore()
      .setKey(this.nearConfig.networkId, this.getAccountId(), accessKey);

    return result;
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: VoteAction,
    gas?: string | number
  ): Promise<FinalExecutionOutcome[]> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

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

  private mapTokenTransferProposal(proposal: CreateProposalParams) {
    const { bond, daoId, description, kind, data } = proposal;

    const {
      token_id: tokenContract,
      receiver_id: recipient,
    } = data as Transfer;

    let storageDepositTransactionAction;
    let transferTransaction;

    switch (this.getWalletType()) {
      case WalletType.SENDER: {
        storageDepositTransactionAction = {
          receiverId: tokenContract,
          actions: [
            {
              methodName: 'storage_deposit',
              args: {
                account_id: recipient,
                registration_only: true,
              },
              gas: GAS_VALUE.toString(),
              deposit: '100000000000000000000000',
            },
          ],
        };

        transferTransaction = {
          receiverId: daoId,
          actions: [
            {
              methodName: 'add_proposal',
              args: {
                proposal: {
                  description,
                  kind: {
                    [kind]: data,
                  },
                },
              },
              gas: GAS_VALUE.toString(),
              deposit: bond,
            },
          ],
        };
        break;
      }
      case WalletType.NEAR:
      default: {
        storageDepositTransactionAction = {
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

        transferTransaction = {
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
      }
    }

    return tokenContract && !USN_TOKEN_CONTRACTS.includes(tokenContract)
      ? [storageDepositTransactionAction, transferTransaction]
      : [transferTransaction];
  }

  public async createTokensTransferProposal(
    proposalsData: CreateProposalParams[]
  ): Promise<FinalExecutionOutcome[]> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    const trx = proposalsData.flatMap(proposal =>
      this.mapTokenTransferProposal(proposal)
    );

    return this.walletService.sendTransactions(trx);
  }

  public async createTokenTransferProposal(
    proposal: CreateProposalParams
  ): Promise<FinalExecutionOutcome[]> {
    if (!this.isSignedIn()) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    const trx = this.mapTokenTransferProposal(proposal);

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
