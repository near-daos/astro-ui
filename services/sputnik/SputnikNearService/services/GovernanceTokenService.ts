import BN from 'bn.js';
import Decimal from 'decimal.js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { transactions } from 'near-api-js';

import { jsonToBase64Str } from 'utils/jsonToBase64Str';
import { formatGasValue } from 'utils/format';

import { WalletType } from 'types/config';

import { GAS_VALUE } from 'services/sputnik/SputnikNearService/services/constants';
import { STAKING_CONTRACT_PREFIX } from 'constants/proposals';

import { getWalletSelectorStorageDepositTransaction } from 'services/sputnik/SputnikNearService/services/utils/getWalletSelectorStorageDepositTransaction';
import { getPlainFunctionCallTransaction } from 'services/sputnik/SputnikNearService/services/utils/getPlainFunctionCallTransaction';

import { BaseService } from './BaseService';

export const ONE_NEAR = new BN(`1${'0'.repeat(24)}`);
export const FIVE_NEAR = ONE_NEAR.mul(new BN(5));

export type MintTokenParams = {
  ownerId: string;
  totalSupply: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: File | null;
};

export type DistributeVotingTokenParams = {
  receiverId: string;
  amount: string;
  tokenId: string;
};

export type DeployStakingContractParams = {
  description: string;
  stakingContractName: string;
  tokenId: string;
  daoId: string;
  daoBond: string;
  unstakingPeriodInHours: number;
};

export type AcceptStakingContractParams = {
  stakingContractName: string;
  daoId: string;
  daoBond: string;
  description: string;
};

export type UpdateVotePolicyToWeightVoting = {
  threshold: string;
};

export type StakeTokensParams = {
  tokenContract: string;
  stakingContract: string;
  amount: string;
};

export type DelegateVotingParams = {
  name: string;
  amount: string;
};

export class GovernanceTokenService extends BaseService {
  getStackingContract(daoId: string): string {
    return `${daoId}${STAKING_CONTRACT_PREFIX}.${this.appConfig.GENERIC_FACTORY_CONTRACT_NAME}`;
  }

  async acceptStakingContract({
    stakingContractName,
    daoId,
    daoBond,
    description,
  }: AcceptStakingContractParams): Promise<FinalExecutionOutcome[]> {
    const contract = `${stakingContractName}.${this.appConfig.GENERIC_FACTORY_CONTRACT_NAME}`;

    return this.walletService.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description,
          kind: {
            SetStakingContract: {
              staking_id: contract,
            },
          },
        },
      },
      gas: formatGasValue(150),
      attachedDeposit: new BN(daoBond),
    });
  }

  async deployStakingContract({
    description,
    stakingContractName,
    tokenId,
    daoId,
    daoBond,
    unstakingPeriodInHours,
  }: DeployStakingContractParams): Promise<FinalExecutionOutcome[]> {
    const { GENERIC_FACTORY_CONTRACT_NAME, STAKING_CONTRACT_BINARY_HASH } =
      this.appConfig;

    const pkAndSignature = await this.walletService.getPkAndSignature();
    const accountId = await this.walletService.getAccountId();

    if (!pkAndSignature) {
      console.error('no public key found for account', accountId);

      return [];
    }

    const { publicKey } = pkAndSignature;

    if (!publicKey) {
      console.error('no public key found for account', accountId);

      return [];
    }

    const encodedStakingContractArgs = jsonToBase64Str({
      token_id: tokenId,
      owner_id: daoId,
      unstake_period: new Decimal(unstakingPeriodInHours)
        .mul('3.6e12')
        .toFixed(),
    });

    const encodedFactoryContractArgs = jsonToBase64Str({
      name: stakingContractName,
      hash: STAKING_CONTRACT_BINARY_HASH,
      access_keys: [publicKey],
      method_name: 'new',
      args: encodedStakingContractArgs,
    });

    return this.walletService.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description,
          kind: {
            FunctionCall: {
              receiver_id: GENERIC_FACTORY_CONTRACT_NAME,
              actions: [
                {
                  method_name: 'create',
                  args: encodedFactoryContractArgs,
                  deposit: FIVE_NEAR.toString(),
                  gas: '150000000000000',
                },
              ],
            },
          },
        },
      },
      gas: formatGasValue(150),
      attachedDeposit: new BN(daoBond),
    });
  }

  async distributeToken(
    daoId: string,
    daoBond: string,
    params: DistributeVotingTokenParams
  ): Promise<FinalExecutionOutcome[]> {
    const { receiverId, amount, tokenId } = params;

    const encodedArgs = jsonToBase64Str({ receiver_id: receiverId, amount });

    return this.walletService.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description: `Sending ${amount} tokens to ${receiverId}`,
          kind: {
            FunctionCall: {
              receiver_id: tokenId,
              actions: [
                {
                  method_name: 'ft_transfer',
                  args: encodedArgs,
                  deposit: '1',
                  gas: '150000000000000',
                },
              ],
            },
          },
        },
      },
      gas: formatGasValue(150),
      attachedDeposit: new BN(daoBond),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async iconAsBase64(file: File | null): Promise<string> {
    if (!file) {
      return '';
    }

    const UploadResizeWidth = 96;
    const UploadResizeHeight = 96;

    const sourceImage = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);

    return new Promise(resolve => {
      sourceImage.onload = () => {
        // Create a canvas with the desired dimensions
        const canvas = document.createElement('canvas');
        const aspect = sourceImage.naturalWidth / sourceImage.naturalHeight;
        const width = Math.round(UploadResizeWidth * Math.max(1, aspect));
        const height = Math.round(UploadResizeHeight * Math.max(1, 1 / aspect));

        canvas.width = UploadResizeWidth;
        canvas.height = UploadResizeHeight;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return;
        }

        // Scale and draw the source image to the canvas
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, UploadResizeWidth, UploadResizeHeight);
        ctx.drawImage(
          sourceImage,
          (UploadResizeWidth - width) / 2,
          (UploadResizeHeight - height) / 2,
          width,
          height
        );

        // Convert the canvas to a data URL in PNG format
        const options = [
          canvas.toDataURL('image/jpeg', 0.92),
          // Disabling webp because it doesn't work on iOS.
          // canvas.toDataURL('image/webp', 0.92),
          canvas.toDataURL('image/png'),
        ];

        options.sort((a, b) => a.length - b.length);

        resolve(options[0]);
      };

      reader.onload = event => {
        sourceImage.src = event.target?.result as string;
      };
    });
  }

  async createMintTokenProposal(
    daoId: string,
    bond: string,
    { ownerId, totalSupply, name, symbol, decimals, icon }: MintTokenParams
  ): Promise<FinalExecutionOutcome> {
    const encodedIcon = await this.iconAsBase64(icon);

    const args = {
      args: {
        owner_id: ownerId,
        total_supply: totalSupply,
        metadata: {
          spec: 'ft-1.0.0',
          name,
          symbol,
          icon: encodedIcon,
          decimals,
        },
      },
    };

    const encodedArgs = jsonToBase64Str(args);

    const result = await this.walletService.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description: `Farming ${totalSupply} units of a new token: ${name} to ${ownerId}`,
          kind: {
            FunctionCall: {
              receiver_id: this.nearConfig.tokenFactoryContractName,
              actions: [
                {
                  method_name: 'create_token',
                  args: encodedArgs,
                  deposit: '5000000000000000000000000',
                  gas: '150000000000000',
                },
              ],
            },
          },
        },
      },
      gas: formatGasValue(150),
      attachedDeposit: new BN(bond),
    });

    return result[0];
  }

  async stakeTokens({
    tokenContract,
    stakingContract,
    amount,
  }: StakeTokensParams): Promise<FinalExecutionOutcome[] | void> {
    const isSignedIn = await this.walletService.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    let userStorageDepositTransactionAction;
    let storageDepositTransactionAction;
    let transferTransaction;

    const accountId = await this.walletService.getAccountId();

    switch (this.walletService.getWalletType()) {
      case WalletType.SENDER: {
        userStorageDepositTransactionAction = {
          receiverId: stakingContract,
          actions: [
            {
              methodName: 'storage_deposit',
              args: {
                account_id: accountId,
              },
              gas: GAS_VALUE.toString(),
              deposit: new Decimal(0.003).mul(10 ** 24).toFixed(),
            },
          ],
        };

        storageDepositTransactionAction = {
          receiverId: tokenContract,
          actions: [
            {
              methodName: 'storage_deposit',
              args: {
                account_id: stakingContract,
              },
              gas: GAS_VALUE.toString(),
              deposit: '100000000000000000000000',
            },
          ],
        };

        transferTransaction = {
          receiverId: tokenContract,
          actions: [
            {
              methodName: 'ft_transfer_call',
              args: {
                receiver_id: stakingContract,
                amount,
                msg: '',
              },
              gas: GAS_VALUE.toString(),
              deposit: '1',
            },
          ],
        };

        break;
      }
      case WalletType.SELECTOR_NEAR: {
        userStorageDepositTransactionAction =
          getWalletSelectorStorageDepositTransaction(
            stakingContract ?? '',
            accountId
          );
        storageDepositTransactionAction =
          getWalletSelectorStorageDepositTransaction(
            tokenContract ?? '',
            stakingContract
          );

        transferTransaction = getPlainFunctionCallTransaction({
          receiverId: tokenContract,
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: stakingContract,
            amount,
            msg: '',
          },
          gas: GAS_VALUE.toString(),
          deposit: '1',
        });

        break;
      }
      case WalletType.NEAR:
      default: {
        userStorageDepositTransactionAction = {
          receiverId: stakingContract,
          actions: [
            transactions.functionCall(
              'storage_deposit',
              {
                account_id: accountId,
              },
              GAS_VALUE,
              new BN(new Decimal(0.003).mul(10 ** 24).toFixed())
            ),
          ],
        };

        storageDepositTransactionAction = {
          receiverId: tokenContract,
          actions: [
            transactions.functionCall(
              'storage_deposit',
              {
                account_id: stakingContract,
              },
              GAS_VALUE,
              new BN('100000000000000000000000')
            ),
          ],
        };

        transferTransaction = {
          receiverId: tokenContract,
          actions: [
            transactions.functionCall(
              'ft_transfer_call',
              {
                receiver_id: stakingContract,
                amount,
                msg: '',
              },
              GAS_VALUE,
              new BN('1')
            ),
          ],
        };
      }
    }

    return this.walletService.sendTransactions([
      storageDepositTransactionAction,
      userStorageDepositTransactionAction,
      transferTransaction,
    ]);
  }

  async unstakeTokens({
    tokenContract,
    stakingContract,
    amount,
  }: StakeTokensParams): Promise<FinalExecutionOutcome[] | void> {
    const isSignedIn = await this.walletService.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    let transferTransaction;

    switch (this.walletService.getWalletType()) {
      case WalletType.SENDER: {
        transferTransaction = {
          receiverId: stakingContract,
          actions: [
            {
              methodName: 'withdraw',
              args: {
                receiver_id: tokenContract,
                amount,
                msg: '',
              },
              gas: GAS_VALUE.toString(),
              // deposit: '1',
            },
          ],
        };

        break;
      }
      case WalletType.NEAR:
      default: {
        transferTransaction = {
          receiverId: stakingContract,
          actions: [
            transactions.functionCall(
              'withdraw',
              {
                receiver_id: tokenContract,
                amount,
                msg: '',
              },
              GAS_VALUE,
              new BN('0')
            ),
          ],
        };
      }
    }

    return this.walletService.sendTransactions([transferTransaction]);
  }

  private mapDelegateVoting(
    stakingContract: string,
    accountId: string,
    amount: string,
    methodName = 'delegate'
  ) {
    let transaction;

    switch (this.walletService.getWalletType()) {
      case WalletType.SENDER: {
        transaction = [
          {
            receiverId: stakingContract,
            actions: [
              {
                methodName: 'storage_deposit',
                args: {
                  account_id: accountId,
                },
                gas: GAS_VALUE.toString(),
                deposit: new Decimal(0.003).mul(10 ** 24).toFixed(),
              },
            ],
          },
          {
            receiverId: stakingContract,
            actions: [
              {
                methodName,
                args: {
                  account_id: accountId,
                  amount,
                },
                gas: GAS_VALUE.toString(),
                deposit: '0',
              },
            ],
          },
        ];

        break;
      }
      case WalletType.SELECTOR_NEAR: {
        transaction = [
          getWalletSelectorStorageDepositTransaction(
            stakingContract ?? '',
            accountId,
            false
          ),
          getPlainFunctionCallTransaction({
            receiverId: stakingContract,
            methodName,
            args: {
              account_id: accountId,
              amount,
            },
            gas: GAS_VALUE.toString(),
            deposit: '0',
          }),
        ];

        break;
      }
      case WalletType.NEAR:
      default: {
        transaction = [
          {
            receiverId: stakingContract,
            actions: [
              transactions.functionCall(
                'storage_deposit',
                {
                  account_id: accountId,
                },
                GAS_VALUE,
                new BN(new Decimal(0.003).mul(10 ** 24).toFixed())
              ),
            ],
          },
          {
            receiverId: stakingContract,
            actions: [
              transactions.functionCall(
                methodName,
                {
                  account_id: accountId,
                  amount,
                },
                GAS_VALUE,
                new BN(0)
              ),
            ],
          },
        ];
      }
    }

    return transaction;
  }

  async delegateVoting(
    stakingContract: string,
    params: DelegateVotingParams[]
  ): Promise<FinalExecutionOutcome[] | void> {
    const isSignedIn = await this.walletService.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    const trx = params.flatMap(({ name, amount }) => [
      ...this.mapDelegateVoting(stakingContract, name, amount),
    ]);

    return this.walletService.sendTransactions(trx);
  }

  async undelegateVoting(
    stakingContract: string,
    params: DelegateVotingParams[]
  ): Promise<FinalExecutionOutcome[] | void> {
    const isSignedIn = await this.walletService.isSignedIn();

    if (!isSignedIn) {
      await this.walletService.signIn(this.nearConfig.contractName);
    }

    const trx = params.flatMap(({ name, amount }) => [
      ...this.mapDelegateVoting(stakingContract, name, amount, 'undelegate'),
    ]);

    return this.walletService.sendTransactions(trx);
  }
}
