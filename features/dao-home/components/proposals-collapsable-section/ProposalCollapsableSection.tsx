import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import React, { FC, useEffect, useState } from 'react';

import { Proposal } from 'types/proposal';

import { VotePeriodKey } from 'constants/votingConstants';

import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { Collapsable } from 'components/collapsable/Collapsable';
import { ProposalCardRenderer } from 'components/cards/proposal-card';

import styles from './proposal-collapsable-section.module.scss';

interface ProposalCollapsableSectionProps {
  proposals: Proposal[];
  expandedProposalId?: string;
  view: VotePeriodKey;
  title: string;
}

export const ProposalCollapsableSection: FC<ProposalCollapsableSectionProps> = ({
  proposals,
  expandedProposalId,
  view,
  title
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const containsExpanded = !!proposals?.find(
      item => item.id === expandedProposalId
    );

    if (containsExpanded) {
      setExpanded(true);
    }
  }, [expandedProposalId, proposals]);

  if (isEmpty(proposals)) {
    return null;
  }

  return (
    <Collapsable
      initialOpenState
      renderHeading={(toggle, isOpen) => (
        <div className={styles.header}>
          <div
            tabIndex={-1}
            role="button"
            onClick={() => {
              if (isOpen) {
                setExpanded(false);
              }

              toggle();
            }}
            onKeyDown={e => e.key === 'Spacebar' && toggle()}
            className={styles.votingEnds}
          >
            {view === 'otherProposals' ? (
              <>
                Voting &nbsp;
                <span className={styles.bold}>ended</span>
              </>
            ) : (
              <>
                Voting ends in &nbsp;
                <span className={styles.bold}>{title}</span>
              </>
            )}
            <IconButton
              icon="buttonArrowRight"
              size="medium"
              className={cn(styles.icon, { [styles.rotate]: isOpen })}
            />
          </div>
          <div className={styles.divider} />
          {proposals.length > 3 && (
            <Button
              size="small"
              variant="tertiary"
              className={styles.toggle}
              onClick={e => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              View {expanded ? 'latest' : 'all'} (
              {expanded ? 3 : proposals.length})
            </Button>
          )}
        </div>
      )}
    >
      <div className={styles.root}>
        {proposals.slice(0, expanded ? undefined : 3).map((item: Proposal) => {
          return (
            <ProposalCardRenderer
              key={item.id}
              proposal={item}
              showExpanded={item.id === expandedProposalId}
            />
          );
        })}
      </div>
    </Collapsable>
  );
};
