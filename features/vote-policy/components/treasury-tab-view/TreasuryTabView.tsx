import React, { FC } from 'react';

import { AccordeonContent } from 'features/vote-policy/components/accordeon-content';
import {
  closeBounty,
  createBounty,
  createPoll,
  nearFunction
} from 'features/vote-policy/components/tasks-tab-view/mockData';
import { AccordeonRow } from 'features/vote-policy/components/accordeon-row';

import styles from './treasury-tab-view.module.scss';

export interface TreasuryTabViewProps {
  viewMode?: boolean;
}

export const TreasuryTabView: FC<TreasuryTabViewProps> = ({
  viewMode = true
}) => {
  const items = [
    {
      id: '1',
      label: 'Create bounty',
      content: (
        <AccordeonContent
          action="Create bounty"
          viewMode={viewMode}
          proposers={createBounty.proposers}
          policies={createBounty.policies}
        />
      )
    },
    {
      id: '2',
      label: 'Close bounty',
      content: (
        <AccordeonContent
          action="Close bounty"
          viewMode={viewMode}
          proposers={closeBounty.proposers}
          policies={closeBounty.policies}
        />
      )
    },
    {
      id: '3',
      label: 'Create poll',
      content: (
        <AccordeonContent
          action="Create poll"
          viewMode={viewMode}
          proposers={createPoll.proposers}
          policies={createPoll.policies}
        />
      )
    },
    {
      id: '4',
      label: 'NEAR function',
      content: (
        <AccordeonContent
          action="NEAR function"
          viewMode={viewMode}
          proposers={nearFunction.proposers}
          policies={nearFunction.policies}
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      <p>
        Create and vote on bounties, resolutions, and calling NEAR functions.
      </p>
      <div className={styles.content}>
        <AccordeonRow items={items} />
      </div>
    </div>
  );
};
