import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { CreateProposalParams } from 'types/proposal';
import { DAO } from 'types/dao';
import BN from 'bn.js';

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

export function getCustomFunctionCallProposal(
  dao: DAO,
  data: CustomFunctionCallInput
): CreateProposalParams {
  const {
    smartContractAddress,
    methodName,
    json,
    deposit,
    details,
    externalUrl,
    actionsGas,
  } = data;

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
          deposit: new BN(deposit).toString(),
          gas: new BN(actionsGas * 10 ** 15).toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}
