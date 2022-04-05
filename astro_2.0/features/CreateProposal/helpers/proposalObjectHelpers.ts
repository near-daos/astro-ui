import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { CreateProposalParams } from 'types/proposal';
import { DAO } from 'types/dao';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import Decimal from 'decimal.js';
import { formatGasValue } from 'utils/format';

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

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;
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
          gas: actionsGas.toString(),
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

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

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
          gas: formatGasValue(actionsGas).toString(),
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

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

  const [key, store] = tokenKey.split(':');

  const json = JSON.stringify({
    token_ids: [[key, target]],
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
          deposit: '1000000000000000000000000',
          gas: formatGasValue(actionsGas).toString(),
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

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

  const json = JSON.stringify({
    token_series_id: tokenKey,
    receiver_id: target,
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
          gas: formatGasValue(actionsGas).toString(),
        },
      ],
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

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

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
          gas: formatGasValue(actionsGas).toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}
