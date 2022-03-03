import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { CreateProposalParams } from 'types/proposal';
import { DAO } from 'types/dao';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import Decimal from 'decimal.js';

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
