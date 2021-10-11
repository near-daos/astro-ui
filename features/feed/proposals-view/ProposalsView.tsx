import { Proposal } from 'types/proposal';
import { ProposalsFilter } from 'features/member-home/types';
import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { splitProposalsByVotingPeriod } from 'helpers/splitProposalsByVotingPeriod';
import { VOTE_BY_PERIOD } from 'constants/votingConstants';
import { arrangeByDao, ProposalsByDaoRenderer } from 'features/member-home';

interface ProposalsTabProps {
  proposals: Proposal[];
  filter: ProposalsFilter;
}

export const ProposalsView: FC<ProposalsTabProps> = ({ proposals, filter }) => {
  const router = useRouter();
  const { proposal: proposalId } = router.query;
  const filteredData = splitProposalsByVotingPeriod(proposals);

  const handleFilterChange = useCallback(
    ({ daoViewFilter }) => {
      router.push({
        pathname: '',
        query: {
          ...router.query,
          daoViewFilter
        }
      });
    },
    [router]
  );

  return (
    <>
      {VOTE_BY_PERIOD.map(period => (
        <ProposalsByDaoRenderer
          filter={filter}
          onFilterChange={handleFilterChange}
          key={period.key}
          title={period.title}
          periodKey={period.key}
          data={arrangeByDao(filteredData[period.key])}
          expandedProposalId={(proposalId ?? '') as string}
        />
      ))}
    </>
  );
};
