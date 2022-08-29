import BN from 'bn.js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import {
  KeyPair,
  keyStores,
  Near,
  providers,
  transactions,
  utils,
} from 'near-api-js';
import { parseContract } from 'near-contract-parser';

import { CreateDaoCustomInput, CreateDaoInput } from 'types/dao';

import { CreateProposalParams, Transfer, VoteAction } from 'types/proposal';

import { formatGasValue } from 'utils/format';

import { FunctionCallOptions } from 'near-api-js/lib/account';
import { mapCreateDaoParamsToContractArgs } from 'services/sputnik/mappers';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';
import { WalletType } from 'types/config';
import { Transaction } from 'services/sputnik/SputnikNearService/walletServices/types';

import { CreateDaoParams, RawMeta } from 'services/sputnik/types';
import { PublicKey } from 'near-api-js/lib/utils';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import {
  AccessKeyList,
  AccountView,
  FunctionCallPermissionView,
} from 'near-api-js/lib/providers/provider';
import { AllowanceKey } from 'services/sputnik/SputnikNearService/types';

import { jsonToBase64Str } from 'utils/jsonToBase64Str';
import { FINALIZE_PROPOSAL_GAS_VALUE, GAS_VALUE } from './constants';
import { getPlainFunctionCallTransaction } from './utils/getPlainFunctionCallTransaction';
import { getWalletSelectorStorageDepositTransaction } from './utils/getWalletSelectorStorageDepositTransaction';

import { BaseService } from './BaseService';

const USN_TOKEN_CONTRACTS = ['usn', 'usdn.testnet'];

export class NearService extends BaseService {
  sendMoney(
    receiverId: string,
    amount: number
  ): Promise<FinalExecutionOutcome[]> {
    return this.walletService.sendMoney(receiverId, amount);
  }

  getWalletType(): WalletType {
    return this.walletService.getWalletType();
  }

  isSignedIn(): Promise<boolean> {
    return this.walletService.isSignedIn();
  }

  functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome[]> {
    return this.walletService.functionCall(props);
  }

  async getPublicKey(): Promise<string | null> {
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    return this.walletService.getPublicKey();
  }

  async getSignature(): Promise<string | null> {
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
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

  public getAccountId(): Promise<string> {
    return this.walletService.getAccountId();
  }

  public async createDao(
    params: CreateDaoInput | CreateDaoCustomInput
  ): Promise<void> {
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    function isCreateDaoParams(
      _params: CreateDaoParams | CreateDaoCustomInput
    ): _params is CreateDaoParams {
      return (_params as CreateDaoParams).policy !== undefined;
    }

    const args = isCreateDaoParams(params)
      ? mapCreateDaoParamsToContractArgs(params)
      : params.args;

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
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
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
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    const accountId = await this.getAccountId();
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
      case WalletType.SELECTOR_NEAR:
      case WalletType.SELECTOR_SENDER: {
        storageDepositTransactionAction =
          getWalletSelectorStorageDepositTransaction(tokenId ?? '', accountId);

        claimAction = getPlainFunctionCallTransaction({
          receiverId: daoId,
          methodName: 'bounty_claim',
          args: {
            id,
            deadline,
          },
          gas,
          deposit: bountyBond,
        });

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
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
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
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
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
    const provider = new providers.JsonRpcProvider(this.nearConfig.nodeUrl);
    const accountId = await this.getAccountId();

    const accessKeys = await provider
      .query<AccessKeyList>({
        request_type: 'view_access_key_list',
        account_id: accountId,
        finality: 'final',
      })
      .then(list => list.keys);

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

    const receiverId = await this.getAccountId();

    const result = await this.sendTransactions([
      {
        receiverId,
        actions: [
          transactions.addKey(
            PublicKey.from(accessKey.getPublicKey()),
            accessKeyTransaction
          ),
        ],
      },
    ]);

    if (
      this.walletService.getWalletType() !== WalletType.SELECTOR_NEAR ||
      this.walletService.getWalletType() !== WalletType.SELECTOR_SENDER
    ) {
      await this.walletService
        .getKeyStore()
        .setKey(this.nearConfig.networkId, receiverId, accessKey);
    }

    return result;
  }

  public async vote(
    daoId: string,
    proposalId: number,
    action: VoteAction,
    gas?: string | number
  ): Promise<FinalExecutionOutcome[]> {
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
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

  private mapVoteProposalAction(
    daoId: string,
    proposalId: string,
    action: string
  ) {
    let transaction;

    switch (this.getWalletType()) {
      case WalletType.SENDER: {
        transaction = {
          receiverId: daoId,
          actions: [
            {
              methodName: 'act_proposal',
              args: {
                id: Number(proposalId),
                action,
              },
              gas: GAS_VALUE.toString(),
              deposit: '0',
            },
          ],
        };

        break;
      }
      case WalletType.SELECTOR_NEAR:
      case WalletType.SELECTOR_SENDER: {
        transaction = getPlainFunctionCallTransaction({
          receiverId: daoId,
          methodName: 'act_proposal',
          args: {
            id: Number(proposalId),
            action,
          },
        });

        break;
      }
      case WalletType.NEAR:
      default: {
        transaction = {
          receiverId: daoId,
          actions: [
            transactions.functionCall(
              'act_proposal',
              {
                id: Number(proposalId),
                action,
              },
              GAS_VALUE,
              new BN(0)
            ),
          ],
        };
      }
    }

    return transaction;
  }

  public async multiVote(
    action: VoteAction,
    params: { daoId: string; proposalId: string }[]
  ): Promise<FinalExecutionOutcome[]> {
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    const trx = params.map(({ daoId, proposalId }) =>
      this.mapVoteProposalAction(daoId, proposalId, action)
    );

    return this.walletService.sendTransactions(trx);
  }

  private mapTokenTransferProposal(proposal: CreateProposalParams) {
    const { bond, daoId, description, kind, data } = proposal;

    const { token_id: tokenContract, receiver_id: recipient } =
      data as Transfer;

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
      case WalletType.SELECTOR_NEAR:
      case WalletType.SELECTOR_SENDER: {
        storageDepositTransactionAction =
          getWalletSelectorStorageDepositTransaction(tokenContract, recipient);

        transferTransaction = getPlainFunctionCallTransaction({
          receiverId: daoId,
          methodName: 'add_proposal',
          args: {
            proposal: {
              description,
              kind: {
                [kind]: data,
              },
            },
          },
          deposit: bond,
        });

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
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
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
    const isSignedIn = await this.isSignedIn();

    if (!isSignedIn) {
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

  async getSmartContractMethods(accountId: string): Promise<string[] | null> {
    try {
      if (!accountId) {
        return null;
      }

      const isValid = await this.nearAccountExist(accountId);

      if (!isValid) {
        return null;
      }

      const keyStore = new keyStores.BrowserLocalStorageKeyStore();

      const near = new Near({
        ...this.nearConfig,
        keyStore,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { code_base64: codeBase64 } = await near.connection.provider.query({
        account_id: accountId,
        finality: 'final',
        request_type: 'view_code',
      });

      const parsed = parseContract(codeBase64);

      const methods = parsed?.methodNames;

      return methods || null;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  public async getContractsMetadata(): Promise<RawMeta[]> {
    return this.callContract<RawMeta[]>(
      this.appConfig.NEAR_CONTRACT_NAME,
      'get_contracts_metadata',
      ''
    );
  }

  public async viewAccount(accountId: string): Promise<AccountView> {
    return this.walletService.viewAccount(accountId);
  }

  public async getFactoryDefaultHash(): Promise<string> {
    return this.callContract<string>(
      this.appConfig.NEAR_CONTRACT_NAME,
      'get_default_code_hash',
      ''
    );
  }

  public async getFtMetadata(
    accountId: string
  ): Promise<{
    symbol: string;
    decimals: number;
  }> {
    return this.callContract<{
      symbol: string;
      decimals: number;
    }>(accountId, 'ft_metadata', '');
  }

  public async getDelegationTotalSupply(
    stakingContract: string
  ): Promise<string> {
    return this.callContract<string>(
      stakingContract,
      'delegation_total_supply',
      ''
    );
  }

  public async getUserDelegation(
    stakingContract: string,
    accountId: string
  ): Promise<{
    // eslint-disable-next-line camelcase
    delegated_amounts: [string, string][];
    // eslint-disable-next-line camelcase
    vote_amount: string;
    // eslint-disable-next-line camelcase
    next_action_timestamp: string;
  }> {
    return this.callContract<{
      // eslint-disable-next-line camelcase
      delegated_amounts: [string, string][];
      // eslint-disable-next-line camelcase
      vote_amount: string;
      // eslint-disable-next-line camelcase
      next_action_timestamp: string;
    }>(stakingContract, 'get_user', jsonToBase64Str({ account_id: accountId }));
  }

  public async getFtBalance(
    tokenContract: string,
    accountId: string
  ): Promise<string> {
    return this.callContract<string>(
      tokenContract,
      'ft_metadata',
      jsonToBase64Str({ accountId })
    );
  }

  public callContract<T>(
    accountId: string,
    viewMethod: string,
    argsAsBase64: string
  ): Promise<T> {
    return this.walletService.contractCall<T>(
      accountId,
      viewMethod,
      argsAsBase64
    );
  }
}
