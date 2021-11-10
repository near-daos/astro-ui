import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { CreateProposalParams } from 'types/proposal';
import { DAO } from 'types/dao';
import { GAS_VALUE } from 'services/sputnik/SputnikNearService/services/SputnikDaoService';
import BN from 'bn.js';

export type CustomFunctionCallInput = {
  smartContractAddress: string;
  methodName: string;
  json: string;
  deposit: string;
  details: string;
  externalUrl: string;
  token: string;
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
  } = data;

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'FunctionCall',
    data: {
      receiver_id: smartContractAddress,
      actions: [
        {
          method_name: methodName,
          args: Buffer.from(JSON.stringify(json)).toString('base64'),
          deposit: new BN(deposit).toString(),
          gas: GAS_VALUE.toString(),
        },
      ],
    },
    bond: dao.policy.proposalBond,
  };
}
