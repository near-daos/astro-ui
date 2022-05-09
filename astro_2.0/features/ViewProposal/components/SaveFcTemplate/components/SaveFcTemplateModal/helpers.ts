import {
  CustomFcTemplatePayload,
  ProposalFeedItem,
  ProposalType,
} from 'types/proposal';

export function getFcTemplateFromProposal(
  proposal: ProposalFeedItem
): CustomFcTemplatePayload | null {
  if (proposal.kind.type !== ProposalType.FunctionCall) {
    return null;
  }

  try {
    const { kind } = proposal;
    const data = kind.actions[0];
    const jsonPayload = JSON.parse(
      Buffer.from(data.args, 'base64').toString('utf-8')
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { methodName, deposit, token, gas } = data;
    const smartContractAddress = kind.receiverId;
    const json = JSON.stringify(jsonPayload, null, 2);

    return {
      methodName,
      deposit,
      smartContractAddress,
      json,
      token,
      actionsGas: gas,
    };
  } catch (e) {
    console.error(e);

    return null;
  }
}
