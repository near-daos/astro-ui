/* eslint-disable max-classes-per-file */
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
import { Tokens } from 'types/token';
import { CreateTransferInput } from 'astro_2.0/features/CreateProposal/components/types';

import { formatGasValue, formatValueToYokto } from 'utils/format';
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

function getToken(tokens: Tokens, tokenInput: string) {
  let token = Object.values(tokens).find(item => item.tokenId === tokenInput);

  if (!token) {
    token = Object.values(tokens).find(item => item.symbol === tokenInput);
  }

  return token;
}

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
  const token = getToken(tokens, data.token);

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

  const token = getToken(tokens, data.token);

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

  const token = getToken(tokens, data.token);

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

interface ReceiptPosition {
  token: string;
  amount: string;
  description: string;
}

export type CreateRoketoStreamInput = {
  tokenId: string;
  shouldDepositForDao: boolean;
  shouldDepositForReceiver: boolean;
  amount: string;
  duration: string;
  speed: string;
  receiverId: string;
  comment?: string;
  actions?: MulticallAction[];
  receipt: {
    total: Record<string, string>;
    positions: ReceiptPosition[];
  };
  details: string;
  externalUrl?: string;
};

interface MulticallAction {
  contract: string;
  method: string;
  args: Record<string, unknown>;
  deposit?: string;
  gas?: string;
}

interface Action {
  func: string;
  args: Record<string, unknown>;
  gas: string;
  depo: string;
}

class Call {
  private actions: Action[];

  constructor(private address: string) {
    this.actions = [];
  }

  addAction(
    func: string,
    args: Record<string, unknown>,
    gas = '10000000000000',
    depo = '0'
  ) {
    this.actions.push({
      func,
      args,
      gas,
      depo,
    });
  }

  serialize(): unknown {
    return {
      address: this.address,
      actions: this.actions.map(action => ({
        func: action.func,
        args: Buffer.from(JSON.stringify(action.args)).toString('base64'),
        gas: action.gas,
        depo: action.depo,
      })),
    };
  }
}

/**
 * Calls in the batch called sequentially
 */
class Batch {
  private calls: Call[] = [];

  createCall(contractAddress: string): Call {
    const call = new Call(contractAddress);

    this.calls.push(call);

    return call;
  }

  serialize(): unknown {
    return this.calls.map(call => call.serialize());
  }
}

/**
 * Multiple batches called in parallel
 */
class Multicall {
  private batches: Batch[] = [];

  createBatch(): Batch {
    const batch = new Batch();

    this.batches.push(batch);

    return batch;
  }

  serialize(): unknown {
    return {
      calls: this.batches.map(batch => batch.serialize()),
    };
  }
}

export async function getCreateRoketoStreamProposal(
  dao: DAO,
  data: CreateRoketoStreamInput,
  tokens: Tokens
): Promise<CreateProposalParams> {
  const { externalUrl, details, actions, receipt } = data;
  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;
  const config = configService.get();
  const multicallContract = config.appConfig.ROKETO_MULTICALL_NAME;

  const token = Object.values(tokens).find(item => item.id === data.tokenId);

  if (!token) {
    throw new Error('No tokens data found');
  }

  let proposalData: {
    // eslint-disable-next-line camelcase
    receiver_id: string;
    actions: FunctionCallAction[];
  } = { receiver_id: '', actions: [] };

  // eslint-disable-next-line no-constant-condition
  if (false) {
    const multicall = new Multicall();
    const serialCalls = multicall.createBatch();

    actions?.forEach(action => {
      serialCalls
        .createCall(action.contract)
        .addAction(action.method, action.args, action.gas, action.deposit);
    });

    proposalData = {
      receiver_id: multicallContract,
      actions: [
        {
          method_name: 'multicall',
          args: Buffer.from(JSON.stringify(multicall.serialize())).toString(
            'base64'
          ),
          deposit: receipt?.total.NEAR ?? '0',
          gas: formatGasValue(270).toString(),
        },
      ],
    };
  } else {
    actions?.forEach(action => {
      proposalData = {
        receiver_id: action.contract,
        actions: [
          {
            method_name: action.method,
            args: Buffer.from(JSON.stringify(action.args)).toString('base64'),
            deposit: action.deposit ?? '1',
            gas: action.gas ?? formatGasValue('270').toString(),
          },
        ],
      };
    });
  }

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: proposalData,
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

  const token = getToken(tokens, dToken);

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
  const { gas, vote, details, proposal, targetDao, externalUrl } = data;

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  const proposalObj = {
    variant: ProposalVariant.VoteInAnotherDao,
    daoId: dao.id,
    description: proposalDescription,
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

  const token = getToken(tokens, dToken);

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

  return {
    description: 'Deploy staking contract via factory',
    stakingContractName: `${name}${STAKING_CONTRACT_PREFIX}`,
    daoId: id,
    tokenId: token,
    daoBond: policy.proposalBond,
    unstakingPeriodInHours: unstakingPeriod,
  } as unknown as CreateProposalParams;
}

export async function getAcceptStakingContractProposal(
  dao: DAO
): Promise<CreateProposalParams> {
  const { id, name, policy } = dao;

  const stakingContractName = `${name}${STAKING_CONTRACT_PREFIX}`;

  return {
    daoId: id,
    daoBond: policy.proposalBond,
    description: `Adopt staking contract ${stakingContractName}`,
    stakingContractName,
  } as unknown as CreateProposalParams;
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

  const { ratio, weightKind, quorum: defaultQuorum } = defaultVotePolicy;

  const {
    threshold: rawThreshold,
    balance: rawBalance,
    quorum: rawQuorum,
    decimals,
    details,
  } = data as {
    threshold: number;
    symbol: string;
    balance: number;
    quorum: number;
    decimals: number;
    details: string;
  };

  const balance = formatValueToYokto(rawBalance, decimals);
  const threshold = formatValueToYokto(rawThreshold, decimals);
  const quorum = formatValueToYokto(rawQuorum, decimals);

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
    quorum: quorum.toString(),
    threshold: threshold.toString(),
  };

  const holdersRole = roles.find(
    role => role.kind === 'Member' && role.name === 'TokenHolders'
  );

  return {
    daoId: id,
    description: details,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: [
          ...roles
            .filter(role => role.kind !== 'Member')
            .map(dataRoleToContractRole),
          {
            name: 'TokenHolders',
            kind: {
              Member: balance?.toString() ?? '1',
            },
            permissions: holdersRole?.permissions ?? ['*:*'],
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
          quorum: defaultQuorum,
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
