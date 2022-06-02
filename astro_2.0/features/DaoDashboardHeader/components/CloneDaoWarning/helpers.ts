import { ProposalFeedItem, ProposalType } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

export function extractNewDaoName(proposal: ProposalFeedItem): string {
  if (proposal.kind.type === ProposalType.FunctionCall) {
    try {
      const { kind } = proposal;
      const data = kind.actions[0];

      const json = JSON.parse(
        Buffer.from(data.args, 'base64').toString('utf-8')
      );

      return json?.name ?? '';
    } catch (e) {
      return '';
    }
  }

  return '';
}

export function isActiveUserCouncil(dao: DAO, acoountId: string): boolean {
  const { roles } = dao.policy;

  const councilRole = roles.find(role => role.name.toLowerCase() === 'council');

  if (councilRole && councilRole.accountIds?.includes(acoountId)) {
    return true;
  }

  return false;
}

export function hasAvailableFunds(tokens: Record<string, Token>): boolean {
  const tokensOptions = Object.values(tokens);

  let hasFunds = false;

  tokensOptions.forEach(token => {
    let max = Number(token.balance);

    if (token.symbol === 'NEAR') {
      const maxPossibleValue = Number(max) - 6;

      if (maxPossibleValue <= 0) {
        max = 0;
      } else {
        max = maxPossibleValue;
      }
    }

    if (max > 0.0001) {
      hasFunds = true;
    }
  });

  return hasFunds;
}
