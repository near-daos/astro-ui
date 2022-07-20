import { useMemo } from 'react';

import {
  useDelegatePageData,
  useVotingPolicyDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';

import { getVotingGoal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/helpers';
import {
  formatPolicyRatio,
  getVoteDetails,
} from 'features/vote-policy/helpers';

import { GroupPolicyDetails, VoterDetail } from 'features/types';
import { ProposalFeedItem } from 'types/proposal';
import { DaoContext } from 'types/context';
import { Member } from 'types/dao';
import { isGroupKind } from 'services/sputnik/mappers';

export function useProposalVotingDetails(
  proposal: ProposalFeedItem,
  daoContext: DaoContext,
  members: Member[]
): {
  votesDetails: VoterDetail[];
  votingPolicyByGroup: Record<string, GroupPolicyDetails>;
} {
  const { dao } = daoContext;
  const { tokenDetails, totalSupply } = useDelegatePageData(daoContext.dao);
  const { threshold: votingThreshold, quorum } = useVotingPolicyDetails(
    daoContext.dao
  );

  const tokensVotingGoal = getVotingGoal(
    Number(votingThreshold),
    Number(totalSupply ?? 0),
    Number(quorum ?? 0)
  );

  const votesDetails = useMemo(() => {
    if (!proposal) {
      return [];
    }

    const { votersList } = getVoteDetails(
      proposal.dao.numberOfMembers,
      proposal.dao.policy.defaultVotePolicy,
      proposal
    );

    const voteActions = proposal?.actions
      .filter(
        item =>
          item.action === 'VoteApprove' ||
          item.action === 'VoteReject' ||
          item.action === 'VoteRemove'
      )
      .reduce((res, item) => {
        res[item.accountId] = item.transactionHash;

        return res;
      }, {} as Record<string, string>);

    const notVotedList = members.reduce((res, item) => {
      const voted = votersList.find(voter => voter.name === item.name);

      if (!voted) {
        res.push({
          name: item.name,
          groups: item.groups,
          vote: null,
          tokens: item.tokens
            ? { ...item.tokens, symbol: tokenDetails?.symbol ?? '' }
            : undefined,
        });
      }

      return res;
    }, [] as VoterDetail[]);

    return [
      ...votersList.map(item => {
        const member = members.find(m => m.name === item.name);

        return {
          ...item,
          groups: member?.groups ?? [],
          transactionHash: voteActions[item.name],
          tokens: member?.tokens
            ? { ...member.tokens, symbol: tokenDetails?.symbol ?? '' }
            : undefined,
        };
      }),
      ...notVotedList,
    ];
  }, [proposal, members, tokenDetails?.symbol]);

  const votingPolicyByGroup = useMemo(() => {
    const result: Record<string, GroupPolicyDetails> = {
      TokenHolders: {
        value: tokensVotingGoal,
        suffix: tokenDetails?.symbol ?? '',
        tooltip: `${tokensVotingGoal} ${tokenDetails?.symbol ?? ''} to pass`,
      },
    };

    dao.policy.roles.forEach(role => {
      if (isGroupKind(role)) {
        const val = role.votePolicy.policy
          ? formatPolicyRatio(role.votePolicy.policy)
          : formatPolicyRatio(dao.policy.defaultVotePolicy);

        result[role.name] = {
          value: val,
          suffix: '%',
          tooltip: `${val}% of group votes to pass`,
        };
      }
    });

    return result;
  }, [
    dao.policy.defaultVotePolicy,
    dao.policy.roles,
    tokenDetails?.symbol,
    tokensVotingGoal,
  ]);

  return {
    votesDetails,
    votingPolicyByGroup,
  };
}
