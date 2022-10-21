import { BountyIndex } from 'services/SearchService/types';
import { BountyContext } from 'types/bounties';
import { toMillis } from 'utils/format';

export function mapBountyIndexToBountyContext(
  item: BountyIndex
): BountyContext {
  const { proposal } = item;

  return {
    id: item.id,
    daoId: item.daoId,
    proposal: proposal
      ? {
          id: proposal.id,
          daoId: proposal.daoId,
          bountyClaimId: proposal.bountyClaimId ?? '',
          proposalId: proposal.proposalId,
          createdAt: new Date(toMillis(item.createTimestamp)).toISOString(),
          updatedAt: '',
          description: proposal.description,
          transactionHash: proposal.transactionHash,
          voteYes: 0,
          voteNo: 0,
          voteRemove: 0,
          proposer: proposal.proposer,
          status: proposal.status,
          voteStatus: proposal.voteStatus,
          kind: proposal.kind ?? {
            type: 'AddBounty',
            bounty: { times: item.times },
          },
          votePeriodEnd: new Date(
            toMillis(proposal.votePeriodEnd)
          ).toISOString(),
          votes: JSON.parse(proposal.votes),
          permissions: {
            canApprove: false,
            canReject: false,
            canDelete: false,
            isCouncil: false,
          },
        }
      : null,
    bounty: {
      bountyId: item.bountyId,
      bountyClaims: JSON.parse(item.bountyClaims),
      daoId: item.daoId,
      id: item.id,
      amount: item.amount,
      bountyDoneProposals: JSON.parse(item.bountyDoneProposals),
      createdAt: new Date(toMillis(item.createTimestamp)).toISOString(),
      description: item.description,
      maxDeadline: item.maxDeadline,
      proposalId: item.proposalId,
      times: item.times,
      token: item.token,
      numberOfClaims: item.numberOfClaims,
    },
    commentsCount: item.commentsCount,
  };
}
