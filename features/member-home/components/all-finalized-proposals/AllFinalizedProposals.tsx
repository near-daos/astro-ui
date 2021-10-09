import React, { FC } from 'react';

import { scrollToTop } from 'utils/scrollToTop';

import { SearchFilters } from 'features/search/search-filters';
import { DaoSection } from 'features/member-home/components/dao-section';
import { DaoViewFilter, ProposalByDao } from 'features/member-home/types';
import { useFilteredProposalsData } from 'features/search/search-results/components/proposals-tab-view/helpers';

import {
  acceptedProposalsStatusFilterOption,
  allStatusFilterOption,
  inactiveProposalsStatusFilterOption,
  rejectedProposalsStatusFilterOption,
  spamDismissedProposalsStatusFilterOption
} from 'features/search/search-filters/helpers';

import styles from './all-finalized-proposals.module.scss';

interface AllFinalizedProposalsProps {
  data: ProposalByDao;
  selectedDao: string | null;
  changeFilter: (filter: DaoViewFilter) => void;
}

export const AllFinalizedProposals: FC<AllFinalizedProposalsProps> = ({
  data,
  selectedDao,
  changeFilter
}) => {
  const proposals = Object.values(data)
    .map(({ proposals: props }) => props)
    .flat();

  const {
    filter,
    onFilterChange,
    filteredProposalsData
  } = useFilteredProposalsData(proposals || []);

  function renderProposalsByDaos() {
    const proposalsByDaos = filteredProposalsData.otherProposals;

    return Object.keys(proposalsByDaos).map(daoName => {
      const daoProposalData = proposalsByDaos[daoName];
      const flag = daoProposalData.dao.logo;

      return (
        <DaoSection
          key={`${daoName}${daoProposalData.proposals.length}`}
          expanded={selectedDao === daoName}
          onFilterSet={() => {
            changeFilter({ daoViewFilter: daoName });
            scrollToTop();
          }}
          filter={selectedDao}
          daoName={daoName}
          proposals={daoProposalData.proposals}
          flag={flag}
        />
      );
    });
  }

  return (
    <div className={styles.root}>
      <SearchFilters
        showFilter={filter.show}
        searchFilter={filter.search}
        includeTasks={filter.tasks}
        includeGroups={filter.groups}
        includeTreasury={filter.treasury}
        includeGovernance={filter.governance}
        onChange={onFilterChange}
        showDaoFilter={false}
        statusDropdownOptions={[
          allStatusFilterOption,
          acceptedProposalsStatusFilterOption,
          inactiveProposalsStatusFilterOption,
          rejectedProposalsStatusFilterOption,
          spamDismissedProposalsStatusFilterOption
        ]}
      />
      {renderProposalsByDaos()}
    </div>
  );
};
