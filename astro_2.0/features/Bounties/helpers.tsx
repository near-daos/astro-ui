import { BountyContext } from 'types/bounties';
import { differenceInMinutes } from 'date-fns';
import { DATA_SEPARATOR } from 'constants/common';
import {
  SINGLE_BOUNTY_PAGE_URL,
  SINGLE_PROPOSAL_PAGE_URL,
} from 'constants/routing';
import { VotingContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/VotingContent';
import React from 'react';
import { DAO } from 'types/dao';
import { SectionItem } from 'astro_2.0/features/Bounties/components/BountiesListView/types';
import { AmountContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/AmountContent';
import { ProposalVariant } from 'types/proposal';
import { Tokens } from 'types/token';

export const BOUNTIES_PAGE_SORT_OPTIONS = [
  {
    label: 'Newest',
    value: 'createdAt,DESC',
  },
  {
    label: 'Oldest',
    value: 'createdAt,ASC',
  },
];

export const BOUNTIES_PAGE_FILTER_OPTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'My',
    value: 'proposer',
  },
  {
    label: 'Empty',
    value: 'numberOfClaims',
  },
  {
    label: 'Hidden',
    value: 'hidden',
  },
];

export function prepareBountyObject(
  bountyContext: BountyContext
): BountyContext {
  if (!bountyContext.bounty) {
    return bountyContext;
  }

  // generate claims based on approved/rejected proposals
  return {
    ...bountyContext,
    bounty: {
      ...bountyContext.bounty,
      bountyClaims: [
        ...bountyContext.bounty.bountyClaims,
        ...bountyContext.bounty.bountyDoneProposals
          .filter(proposal => {
            return proposal.status !== 'InProgress';
          })
          .map(proposal => ({
            id: proposal.id,
            accountId: proposal.proposer,
            startTime: '',
            deadline: bountyContext.bounty.maxDeadline,
            completed: true,
            endTime: '',
          })),
      ],
    },
  };
}

export function prepareBountiesPageContent(
  data: BountyContext[],
  dao: DAO,
  accountId: string,
  completeHandler: (
    id: number,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void,
  tokens: Tokens
): {
  proposalPhase: SectionItem[];
  bounties: SectionItem[];
  completed: SectionItem[];
} {
  const result = data.reduce<{
    proposalPhase: BountyContext[];
    bounties: BountyContext[];
    completed: BountyContext[];
  }>(
    (res, item) => {
      if (!item.proposal) {
        return res;
      }

      if (item.proposal && !item.bounty) {
        res.proposalPhase.push(item);

        return res;
      }

      if (item.bounty && Number(item.bounty.times) === 0) {
        res.completed.push(item);

        return res;
      }

      if (item.bounty) {
        res.bounties.push(item);

        return res;
      }

      return res;
    },
    {
      proposalPhase: [],
      bounties: [],
      completed: [],
    }
  );

  return {
    proposalPhase: result.proposalPhase
      .filter(item => item.proposal)
      .map(item => {
        const [description] = item.proposal
          ? item.proposal.description.split(DATA_SEPARATOR)
          : [''];

        return {
          id: item.id,
          title: description,
          proposer: item.proposal?.proposer ?? '',
          proposalId: item.proposal?.id ?? '',
          link: {
            pathname: SINGLE_PROPOSAL_PAGE_URL,
            query: {
              dao: dao.id,
              proposal: item.proposal?.id ?? '',
            },
          },
          content: item.proposal ? (
            <VotingContent
              proposal={item.proposal}
              accountId={accountId}
              daoId={dao.id}
            />
          ) : null,
        };
      }),
    bounties: result.bounties.map(item => {
      const [description] = item.bounty.description.split(DATA_SEPARATOR);

      return {
        id: item.id,
        title: description,
        proposer: item.proposal?.proposer ?? '',
        proposalId: item.proposal?.id ?? '',
        bounty: item.bounty,
        link: {
          pathname: SINGLE_BOUNTY_PAGE_URL,
          query: {
            dao: dao.id,
            bountyContext: item.id,
          },
        },
        completeHandler,
        content: (
          <AmountContent
            tokens={tokens}
            amount={item.bounty.amount}
            token={item.bounty.token}
            commentsCount={item.commentsCount}
          />
        ),
      };
    }),
    completed: result.completed.map(item => {
      const [description] = item.bounty.description.split(DATA_SEPARATOR);

      return {
        id: item.id,
        title: description,
        proposer: item.proposal?.proposer ?? '',
        proposalId: item.proposal?.id ?? '',
        bounty: item.bounty,
        link: {
          pathname: SINGLE_BOUNTY_PAGE_URL,
          query: {
            dao: dao.id,
            bountyContext: item.id,
          },
        },
        content: (
          <AmountContent
            tokens={tokens}
            amount={item.bounty.amount}
            token={item.bounty.token}
            commentsCount={item.commentsCount}
          />
        ),
      };
    }),
  };
}

export function getClaimProgress(
  start: Date,
  end: Date,
  status: string
): number {
  const now = new Date();

  if (now > end || status !== 'InProgress') {
    return 100;
  }

  const totalLength = differenceInMinutes(end, start);
  const lengthFromNow = differenceInMinutes(now, start);

  return (lengthFromNow * 100) / totalLength;
}
