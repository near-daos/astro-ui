import { BountyIndex } from 'services/SearchService/types';
import { BountyContext } from 'types/bounties';
import { toMillis } from 'utils/format';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';
import get from 'lodash/get';
import { fromBase64ToMetadata } from 'services/sputnik/mappers';
import { mapTokenIndexToToken } from 'services/SearchService/mappers/tokens';
import { Token } from 'types/token';

export function mapBountyIndexToBountyContext(
  item: BountyIndex
): BountyContext {
  const { proposal } = item;

  const config = get(proposal, 'dao.config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  return {
    id: item.id,
    daoId: item.daoId,
    proposal: proposal
      ? {
          id: proposal.id,
          daoId: proposal.daoId,
          bountyClaimId: proposal.bountyClaimId ?? '',
          proposalId: proposal.proposalId,
          createdAt: item.createTimestamp
            ? new Date(toMillis(item.createTimestamp)).toISOString()
            : '',
          updatedAt: item.updateTimestamp
            ? new Date(toMillis(item.updateTimestamp)).toISOString()
            : '',
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
          dao: {
            id: proposal.dao?.id,
            name: proposal.dao?.config.name ?? '',
            logo: meta?.flag
              ? getAwsImageUrl(meta.flag)
              : '/flags/defaultDaoFlag.png',
            flagCover: getAwsImageUrl(meta?.flagCover),
            flagLogo: getAwsImageUrl(meta?.flagLogo),
            legal: meta?.legal || {},
            numberOfMembers: proposal.dao?.numberOfMembers,
            policy: proposal.dao?.policy,
            tokens: proposal.dao?.tokens
              .map(mapTokenIndexToToken)
              .reduce<Record<string, Token>>((acc, tkn) => {
                acc[tkn.tokenId || tkn.symbol] = tkn;

                return acc;
              }, {}),
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
      bountyClaims: item.bountyClaims ? JSON.parse(item.bountyClaims) : [],
      daoId: item.daoId,
      id: item.id,
      amount: item.amount,
      bountyDoneProposals: JSON.parse(item.bountyDoneProposals),
      createdAt: item.createTimestamp
        ? new Date(toMillis(item.createTimestamp)).toISOString()
        : '',
      description: item.description,
      maxDeadline: item.maxDeadline,
      proposalId: item.proposalId,
      times: item.times,
      token: item.token,
      numberOfClaims: item.numberOfClaims,
      tags: item.tags ?? [],
      entityId: item.entityId,
    },
    commentsCount: item.commentsCount,
  };
}
