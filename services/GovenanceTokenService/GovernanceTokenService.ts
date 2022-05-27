import { WalletService } from 'services/sputnik/SputnikNearService/services/types';
import { jsonToBase64Str } from 'utils/jsonToBase64Str';
import { formatGasValue } from 'utils/format';
import BN from 'bn.js';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { NearConfig } from 'config/near';

export const ONE_NEAR = new BN(`1${'0'.repeat(24)}`);
export const FIVE_NEAR = ONE_NEAR.mul(new BN(5));

export const GENERIC_FACTORY = 'generic.testnet';

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
  stakingContractName: string;
  tokenId: string;
  daoId: string;
  daoBond: string;
};

export type AcceptStakingContractParams = {
  stakingContractName: string;
  daoId: string;
  daoBond: string;
};

export class GovernanceTokenService {
  private readonly walletService;

  private readonly nearConfig;

  constructor(walletService: WalletService, nearConfig: NearConfig) {
    this.walletService = walletService;
    this.nearConfig = nearConfig;
  }

  async acceptStakingContract({
    stakingContractName,
    daoId,
    daoBond,
  }: AcceptStakingContractParams): Promise<FinalExecutionOutcome[]> {
    const contract = `${stakingContractName}.${GENERIC_FACTORY}`;

    return this.walletService.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description: `Accept staking contract ${contract}`,
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
    stakingContractName,
    tokenId,
    daoId,
    daoBond,
  }: DeployStakingContractParams): Promise<FinalExecutionOutcome[]> {
    const currentAccountPublicKey = await this.walletService.getPublicKey();

    if (!currentAccountPublicKey) {
      console.error(
        'no public key found for account',
        this.walletService.getAccountId()
      );

      return [];
    }

    const encodedStakingContractArgs = jsonToBase64Str({
      token_id: tokenId,
      owner_id: daoId,
      unstake_period: '604800000000000',
    });

    const encodedFactoryContractArgs = jsonToBase64Str({
      name: stakingContractName,
      hash: '4ThdGjTKbBTad45CyePPAiZmWJEpEoFwViFusy4cpEmA',
      access_keys: [currentAccountPublicKey],
      method_name: 'new',
      args: encodedStakingContractArgs,
    });

    return this.walletService.functionCall({
      methodName: 'add_proposal',
      contractId: daoId,
      args: {
        proposal: {
          description: `Deploy staking contract via factory`,
          kind: {
            FunctionCall: {
              receiver_id: GENERIC_FACTORY,
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
    //
    // return this.walletService.functionCall({
    //   contractId: 'generic.testnet',
    //   methodName: 'create',
    //   args: {
    //     name: contractName,
    //     hash: '4ThdGjTKbBTad45CyePPAiZmWJEpEoFwViFusy4cpEmA',
    //     access_keys: [currentAccountPublicKey],
    //     args: encodedArgs,
    //   },
    //   gas: formatGasValue(200),
    //   attachedDeposit: ONE_NEAR.mul(new BN(5)),
    // });
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
}
