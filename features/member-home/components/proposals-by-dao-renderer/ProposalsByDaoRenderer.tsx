import isEmpty from 'lodash/isEmpty';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Button } from 'components/button/Button';
import styles from 'features/search/search-results/components/proposals-tab-view/proposals-tab-view.module.scss';
import { Icon } from 'components/Icon';
import classNames from 'classnames';

import React, { FC, useCallback } from 'react';
import { ProposalByDao, ProposalsFilter } from 'features/member-home/types';
import { DaoSection } from 'features/member-home/components/dao-section';

interface ProposalsByDaoRendererProps {
  title: string;
  data: ProposalByDao;
  filter: ProposalsFilter;
  onFilterChange: (name: string, value: string) => void;
}

export const ProposalsByDaoRenderer: FC<ProposalsByDaoRendererProps> = ({
  title,
  data,
  filter,
  onFilterChange
}) => {
  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isEmpty(data)) {
    return null;
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
          Voting ends in &nbsp;
          <div className={styles.bold}>{title}</div>
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
