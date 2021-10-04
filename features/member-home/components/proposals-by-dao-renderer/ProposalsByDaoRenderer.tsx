import isEmpty from 'lodash/isEmpty';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Button } from 'components/button/Button';
import styles from 'features/search/search-results/components/proposals-tab-view/proposals-tab-view.module.scss';
import { Icon } from 'components/Icon';
import classNames from 'classnames';

import React, { FC, useCallback } from 'react';
import { ProposalByDao, ProposalsFilter } from 'features/member-home/types';
import { DaoSection } from 'features/member-home/components/dao-section';
import { VotePeriodKey } from 'constants/votingConstants';

interface ProposalsByDaoRendererProps {
  title: string;
  periodKey: VotePeriodKey;
  data: ProposalByDao;
  filter: ProposalsFilter;
  onFilterChange: (name: string, value: string) => void;
}

export const ProposalsByDaoRenderer: FC<ProposalsByDaoRendererProps> = ({
  title,
  periodKey,
  data,
  filter,
  onFilterChange
}) => {
  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

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
      {Object.keys(data).length ? (
        <>
          {Object.keys(data).map(daoName => {
            const daoProposalData = data[daoName];
            const flag = daoProposalData.dao.logo;

            return (
              <DaoSection
                key={daoName}
                expanded={filter.daoViewFilter === daoName}
                onFilterSet={() => {
                  onFilterChange('daoViewFilter', daoName);
                  scrollToTop();
                }}
                filter={filter.daoViewFilter}
                daoName={daoName}
                proposals={daoProposalData.proposals}
                flag={flag}
              />
            );
          })}
        </>
      ) : (
        <div className={styles.noDataWarning}>There are no proposals</div>
      )}
    </Collapsable>
  );
};
