import Decimal from 'decimal.js';

import { DATA_SEPARATOR } from 'constants/common';
import { STAKING_CONTRACT_PREFIX } from 'constants/proposals';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';

import { DAO } from 'types/dao';
import {
  CreateProposalParams,
  DaoConfig,
  FunctionCallAction,
  ProposalVariant,
} from 'types/proposal';
import { CreateTokenInput } from 'astro_2.0/features/CreateProposal/types';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { CreateTransferInput } from 'astro_2.0/features/CreateProposal/components/types';

import { formatGasValue } from 'utils/format';
import { jsonToBase64Str } from 'utils/jsonToBase64Str';
import { dataRoleToContractRole } from 'features/groups/helpers';

import { configService } from 'services/ConfigService';

export type CustomFunctionCallInput = {
  smartContractAddress: string;
  methodName: string;
  json: string;
  deposit: string;
  details: string;
  externalUrl: string;
  token: string;
  actionsGas: number;
};

export function getUpgradeCodeProposal(
  dao: DAO,
  data: Record<string, string>
): CreateProposalParams {
  const { versionHash, details, externalUrl } = data;
  const { appConfig } = configService.get();

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const args = jsonToBase64Str({
    code_hash: versionHash,
  });

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: appConfig.NEAR_CONTRACT_NAME,
      actions: [
        {
          method_name: 'store_contract_self',
          args,
          deposit: new Decimal(6000000000000000000000000).toFixed(),
          gas: '220000000000000',
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export function getRemoveUpgradeCodeProposal(
  dao: DAO,
  data: Record<string, string>
): CreateProposalParams {
  const { versionHash, details, externalUrl } = data;
  const { appConfig } = configService.get();

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const args = jsonToBase64Str({
    code_hash: versionHash,
  });

  return {
    variant: ProposalVariant.ProposeRemoveUpgradeCode,
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: appConfig.NEAR_CONTRACT_NAME,
      actions: [
        {
          method_name: 'remove_contract_self',
          args,
          deposit: '0',
          gas: '220000000000000',
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export function getUpgradeSelfProposal(
  dao: DAO,
  data: Record<string, string>
): CreateProposalParams {
  const { versionHash, details, externalUrl } = data;

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'UpgradeSelf',
    data: {
      hash: versionHash,
    },
    bond: dao.policy.proposalBond,
  };
}

export async function getCustomFunctionCallProposal(
  dao: DAO,
  data: CustomFunctionCallInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const {
    smartContractAddress,
    methodName,
    json,
    deposit,
    details,
    externalUrl,
    actionsGas,
  } = data;
  const token = Object.values(tokens).find(item => item.symbol === data.token);

  if (!token) {
    throw new Error('No tokens data found');
  }

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;
  const args = Buffer.from(json).toString('base64');

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: smartContractAddress,
      actions: [
        {
          method_name: methodName,
          args,
          deposit: new Decimal(deposit).mul(10 ** token.decimals).toFixed(),
          gas: formatGasValue(actionsGas ?? DEFAULT_PROPOSAL_GAS).toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export type BuyNftFromMintbaseInput = {
  tokenKey: string;
  price: number;
  timeout: string;
  timeoutGranularity: 'days' | 'minutes' | 'hours';
  actionsGas: number;
  deposit: string;
  details: string;
  externalUrl: string;
  token: string;
  target: string;
};

export async function getBuyNftFromMintbaseProposal(
  dao: DAO,
  data: BuyNftFromMintbaseInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const {
    tokenKey,
    timeout,
    timeoutGranularity,
    deposit,
    details,
    externalUrl,
    actionsGas,
  } = data;

  const token = Object.values(tokens).find(item => item.symbol === data.token);

  if (!token) {
    throw new Error('No tokens data found');
  }

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const json = JSON.stringify({
    token_key: [tokenKey],
    price: [new Decimal(deposit).mul(10 ** token.decimals).toFixed()],
    timeout: [
      {
        [timeoutGranularity]: timeout,
      },
    ],
  });
  const args = Buffer.from(json).toString('base64');

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: 'market.mintbase1.near',
      actions: [
        {
          method_name: 'make_offer',
          args,
          deposit: new Decimal(deposit).mul(10 ** token.decimals).toFixed(),
          gas: formatGasValue(actionsGas ?? DEFAULT_PROPOSAL_GAS).toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export type TransferMintbaseNFTInput = {
  smartContractAddress: string;
  tokenKey: string;
  actionsGas: number;
  details: string;
  externalUrl: string;
  target: string;
};

export async function getTransferMintbaseNFTProposal(
  dao: DAO,
  data: TransferMintbaseNFTInput
): Promise<CreateProposalParams> {
  const { tokenKey, target, details, externalUrl, actionsGas } = data;

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const [key, store] = tokenKey.split(':');

  const json = JSON.stringify({
    token_ids: [[key, target.trim()]],
  });
  const args = Buffer.from(json).toString('base64');

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: store,
      actions: [
        {
          method_name: 'nft_batch_transfer',
          args,
          deposit: '1',
          gas: formatGasValue(actionsGas ?? DEFAULT_PROPOSAL_GAS).toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export type BuyNftFromParasInput = {
  tokenKey: string;
  price: number;
  timeout: string;
  actionsGas: number;
  deposit: string;
  details: string;
  externalUrl: string;
  token: string;
  target: string;
  smartContractAddress: string;
  methodName: string;
};

export async function getBuyNftFromParasProposal(
  dao: DAO,
  data: BuyNftFromParasInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const { tokenKey, target, details, externalUrl, actionsGas, deposit } = data;

  const token = Object.values(tokens).find(item => item.symbol === data.token);

  if (!token) {
    throw new Error('No tokens data found');
  }

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const json = JSON.stringify({
    token_series_id: tokenKey,
    receiver_id: target.trim(),
  });
  const args = Buffer.from(json).toString('base64');

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: 'x.paras.near',
      actions: [
        {
          method_name: 'nft_buy',
          args,
          deposit: new Decimal(deposit).mul(10 ** token.decimals).toFixed(),
          gas: formatGasValue(actionsGas ?? DEFAULT_PROPOSAL_GAS).toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export type CreateRoketoStreamInput = {
  details: string;
  externalUrl?: string;

  // Stream configuration
  receiverId: string;
  tokenId: string;
  amount: string;
  comment?: string;

  tokensPerSec: string;
  cliffPeriodInSec?: string;
  isAutoStartEnabled?: boolean;
  isLocked?: boolean;
};

export async function getCreateRoketoStreamProposal(
  dao: DAO,
  data: CreateRoketoStreamInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const { externalUrl, details, ...stream } = data;
  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const token = Object.values(tokens).find(item => item.id === data.tokenId);

  if (!token) {
    throw new Error('No tokens data found');
  }

  const deposit = new Decimal(stream.amount)
    .mul(10 ** token.decimals)
    .toFixed();

  const CreateRequest = {
    Create: {
      request: {
        owner_id: dao.id,
        receiver_id: stream.receiverId,
        tokens_per_sec: new Decimal(stream.tokensPerSec).toFixed(),
        description: stream.comment,
        cliff_period_in_sec: stream.cliffPeriodInSec,
        is_auto_start_enabled: stream.isAutoStartEnabled,
        is_expirable: true,
        is_locked: stream.isLocked,
      },
    },
  };

  const TransferCall = {
    receiver_id: 'streaming-r-v2.dcversus.testnet', // move to ENV VAR
    amount: new Decimal('1').toFixed(),
    memo: details,
    msg: JSON.stringify(CreateRequest),
  };

  // TODO read commission from the creation form

  // https://github.com/roke-to/roketo-ui/blob/master/src/shared/api/ft/ft-api.ts#L101
  const actions: FunctionCallAction[] = [
    {
      method_name: 'ft_transfer_call',
      deposit: new Decimal(deposit).toFixed(),
      args: Buffer.from(JSON.stringify(TransferCall)).toString('base64'),
      gas: formatGasValue(300).toString(),
    },
  ];
  const isNear = token.tokenId === 'NEAR';

  if (isNear) {
    actions.unshift({
      method_name: 'near_deposit',
      deposit,
      args: Buffer.from('{}').toString('base64'),
      gas: formatGasValue(DEFAULT_PROPOSAL_GAS).toString(),
    });
  }

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: token.tokenId,
      actions,
    },
    bond: dao.policy.proposalBond,
  };
}

export type SwapsOnRefInput = {
  poolId: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  amountInToken: string;
  amountOutToken: string;
  actionsGas: number;
  details: string;
  externalUrl: string;
  target: string;
};

export async function getSwapsOnRefProposal(
  dao: DAO,
  data: SwapsOnRefInput
): Promise<CreateProposalParams> {
  const {
    poolId,
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    actionsGas,
    details,
    externalUrl,
  } = data;

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const json = JSON.stringify({
    actions: [
      {
        pool_id: poolId,
        token_in: tokenIn,
        token_out: tokenOut,
        amount_in: amountIn,
        min_amount_out: amountOut,
      },
    ],
  });
  const args = Buffer.from(json).toString('base64');

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: 'v2.ref-finance.near',
      actions: [
        {
          method_name: 'ft_transfer_call',
          args,
          deposit: '1000000000000000000000000',
          gas: formatGasValue(actionsGas ?? DEFAULT_PROPOSAL_GAS).toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export async function getCreateTokenProposal(
  dao: DAO,
  data: CreateTokenInput
): Promise<CreateProposalParams> {
  const { details, externalUrl } = data;

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const args = jsonToBase64Str({});

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: dao.id,
      actions: [
        {
          method_name: 'store_contract_self',
          args,
          deposit: new Decimal(6000000000000000000000000).toFixed(),
          gas: '220000000000000',
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export async function getTransferProposal(
  dao: DAO,
  data: CreateTransferInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const { token: dToken, details, externalUrl, target, amount } = data;

  const token = Object.values(tokens).find(item => item.symbol === dToken);

  if (!token) {
    throw new Error('No tokens data found');
  }

  return {
    daoId: dao.id,
    description: `${details}${DATA_SEPARATOR}${externalUrl}`,
    kind: 'Transfer',
    bond: dao.policy.proposalBond,
    data: {
      token_id: token?.tokenId,
      receiver_id: target.trim(),
      amount: new Decimal(amount).mul(10 ** token.decimals).toFixed(),
    },
  };
}

export function getChangeConfigProposal(
  daoId: string,
  { name, purpose, metadata }: DaoConfig,
  reason: string,
  proposalBond: string
): CreateProposalParams {
  return {
    kind: 'ChangeConfig',
    daoId,
    data: {
      config: {
        metadata,
        name,
        purpose,
      },
    },
    description: reason,
    bond: proposalBond,
  };
}

export async function getVoteInOtherDaoProposal(
  dao: DAO,
  data: Record<string, string>
): Promise<CreateProposalParams> {
  const { gas, vote, details, proposal, targetDao } = data;

  const proposalObj = {
    variant: ProposalVariant.VoteInAnotherDao,
    daoId: dao.id,
    description: details,
    kind: 'FunctionCall' as const,
    data: {
      receiver_id: targetDao,
      actions: [
        {
          method_name: 'act_proposal',
          args: jsonToBase64Str({
            id: parseInt(proposal, 10),
            action: vote,
          }),
          deposit: '0',
          gas: formatGasValue(gas).toString(),
        },
      ],
    },
    bond: dao?.policy.proposalBond,
  };

  return proposalObj;
}

export function getNewDaoProposal(
  dao: DAO,
  data: Record<string, string>
): CreateProposalParams {
  const { nearConfig } = configService.get();
  const { details, externalUrl, displayName, address } = data;

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const daoArgs = JSON.stringify({
    name: address,
    args: jsonToBase64Str({
      purpose: dao.description,
      bond: dao.policy.proposalBond,
      vote_period: dao.policy.proposalPeriod,
      grace_period: dao.policy.bountyForgivenessPeriod,
      policy: {
        roles: dao.policy.roles.map(role => ({
          name: role.name,
          kind: role.kind === 'Group' ? { Group: role.accountIds } : role.kind,
          permissions: role.permissions,
          vote_policy: role.votePolicy
            ? Object.keys(role.votePolicy).reduce<Record<string, unknown>>(
                (res, key) => {
                  const value = role.votePolicy[key];

                  res[key] = {
                    weight_kind: value.weightKind,
                    quorum: value.quorum,
                    threshold: value.ratio ?? value.weight,
                  };

                  return res;
                },
                {}
              )
            : {},
        })),
        default_vote_policy: {
          weight_kind: dao.policy.defaultVotePolicy.weightKind,
          quorum: dao.policy.defaultVotePolicy.quorum,
          threshold: dao.policy.defaultVotePolicy.ratio,
        },
        proposal_bond: dao.policy.proposalBond,
        proposal_period: dao.policy.proposalPeriod,
        bounty_bond: dao.policy.bountyBond,
        bounty_forgiveness_period: dao.policy.bountyForgivenessPeriod,
      },
      config: {
        name: address,
        purpose: dao.description,
        metadata: jsonToBase64Str({
          links: dao.links,
          flagCover: dao.flagCover,
          flagLogo: dao.flagLogo,
          displayName,
          legal: dao.legal,
        }),
      },
    }),
  });

  const args = Buffer.from(daoArgs).toString('base64');

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: nearConfig.contractName,
      actions: [
        {
          method_name: 'create',
          args,
          deposit: new Decimal(6).mul(10 ** 24).toFixed(),
          gas: '220000000000000',
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}

export function getTransferDaoFundsProposal(
  dao: DAO,
  data: Record<string, string>,
  tokens: Tokens
): CreateProposalParams {
  const { token: dToken, details, externalUrl, target, amount } = data;

  const token = Object.values(tokens).find(item => item.symbol === dToken);

  if (!token) {
    throw new Error('No tokens data found');
  }

  return {
    daoId: dao.id,
    description: `${details}${DATA_SEPARATOR}${externalUrl}`,
    kind: 'Transfer',
    bond: dao.policy.proposalBond,
    data: {
      token_id: token?.tokenId,
      receiver_id: target.trim(),
      amount: new Decimal(amount).mul(10 ** token.decimals).toFixed(),
    },
  };
}

export async function getDeployStakingContractProposal(
  dao: DAO,
  data: Record<string, unknown>
): Promise<CreateProposalParams> {
  const { id, name, policy } = dao;
  const { unstakingPeriod, token } = data;

  return ({
    description: 'Deploy staking contract via factory',
    stakingContractName: `${name}${STAKING_CONTRACT_PREFIX}`,
    daoId: id,
    tokenId: token,
    daoBond: policy.proposalBond,
    unstakingPeriodInHours: unstakingPeriod,
  } as unknown) as CreateProposalParams;
}

export async function getAcceptStakingContractProposal(
  dao: DAO
): Promise<CreateProposalParams> {
  const { id, name, policy } = dao;

  const stakingContractName = `${name}${STAKING_CONTRACT_PREFIX}`;

  return ({
    daoId: id,
    daoBond: policy.proposalBond,
    description: `Accept staking contract ${stakingContractName}`,
    stakingContractName,
  } as unknown) as CreateProposalParams;
}

export async function getChangeVotingPolicyToWeightVoting(
  dao: DAO,
  data: Record<string, unknown>
): Promise<CreateProposalParams> {
  const { id, policy } = dao;
  const {
    roles,
    bountyBond,
    proposalBond,
    proposalPeriod,
    defaultVotePolicy,
    bountyForgivenessPeriod,
  } = policy;

  const { ratio, quorum, weightKind } = defaultVotePolicy;

  const { threshold } = data;

  // TODO: add selector or use wildcard instead(should be changed on a smart contract side)
  const proposalKindPolicyLabels = [
    'config',
    'policy',
    'add_member_to_role',
    'remove_member_from_role',
    'call',
    'upgrade_self',
    'upgrade_remote',
    'transfer',
    'set_vote_token',
    'add_bounty',
    'bounty_done',
    'vote',
    'factory_info_update',
    'policy_add_or_update_role',
    'policy_remove_role',
    'policy_update_default_vote_policy',
    'policy_update_parameters',
  ];

  const tokenWeightDefaultPolicy = {
    weight_kind: 'TokenWeight',
    quorum: '0',
    threshold: `${threshold}`,
  };

  return {
    daoId: id,
    description: `Change voting policy to weight voting`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: [
          ...roles.map(dataRoleToContractRole),
          {
            name: 'TokenHolders',
            kind: {
              Member: '1',
            },
            permissions: ['*:*'],
            vote_policy: proposalKindPolicyLabels.reduce(
              (acc, value) => ({
                ...acc,
                [value]: { ...tokenWeightDefaultPolicy },
              }),
              {}
            ),
          },
        ],
        default_vote_policy: {
          weight_kind: weightKind,
          quorum,
          threshold: ratio,
        },
        proposal_bond: proposalBond,
        proposal_period: proposalPeriod,
        bounty_bond: bountyBond,
        bounty_forgiveness_period: bountyForgivenessPeriod,
      },
    },
    bond: dao.policy.proposalBond,
  };
}
