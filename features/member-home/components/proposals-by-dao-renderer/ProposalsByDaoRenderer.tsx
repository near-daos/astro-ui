import React, { FC } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { VotePeriodKey } from 'constants/votingConstants';

import { scrollToTop } from 'utils/scrollToTop';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { Collapsable } from 'components/collapsable/Collapsable';

import { DaoSection } from 'features/member-home/components/dao-section';
import {
  DaoViewFilter,
  ProposalByDao,
  ProposalsFilter
} from 'features/member-home/types';

import styles from 'features/search/search-results/components/proposals-tab-view/proposals-tab-view.module.scss';

interface ProposalsByDaoRendererProps {
  title: string;
  periodKey: VotePeriodKey;
  data: ProposalByDao;
  filter: ProposalsFilter;
  onFilterChange: (filter: DaoViewFilter) => void;
}

export const ProposalsByDaoRenderer: FC<ProposalsByDaoRendererProps> = ({
  title,
  periodKey,
  data,
  filter,
  onFilterChange
}) => {
  if (
    isEmpty(data) ||
    (periodKey === 'otherProposals' &&
      filter.proposalFilter === 'Active proposals')
  ) {
    return null;
  }

  function getHeader() {
    if (periodKey === 'otherProposals') {
      return (
        <>
          Voting &nbsp;
          <span className={styles.bold}>ended</span>
        </>
      );
    }

    return (
      <>
        Voting ends in &nbsp;
        <span className={styles.bold}>{title}</span>
      </>
    );
  }

  return (
    <Collapsable
      key={title}
      className={styles.collapseControl}
      initialOpenState
      renderHeading={(toggleHeading, isHeadingOpen) => (
        <Button
          size="small"
          variant="tertiary"
          className={styles.votingEnds}
          onClick={() => toggleHeading()}
        >
          {getHeader()}
          <Icon
            name="buttonArrowRight"
            width={24}
            className={classNames(styles.icon, {
              [styles.rotate]: isHeadingOpen
            })}
          />
        </Button>
      )}
    >
      {Object.keys(data).map(daoName => {
        const daoProposalData = data[daoName];
        const flag = daoProposalData.dao.logo;

        return (
          <DaoSection
            key={daoName}
            expanded={filter.daoViewFilter === daoName}
            onFilterSet={() => {
              onFilterChange({ daoViewFilter: daoName });
              scrollToTop();
            }}
            filter={filter.daoViewFilter}
            daoName={daoName}
            proposals={daoProposalData.proposals}
            flag={flag}
          />
        );
      })}
    </Collapsable>
  );
};
