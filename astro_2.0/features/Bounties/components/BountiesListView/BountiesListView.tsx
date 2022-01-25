import React, { FC } from 'react';

import { BountyContext } from 'types/bounties';

import { CollapsableSection } from 'astro_2.0/features/Bounties/components/BountiesListView/components/CollapsableSection';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import styles from './BountiesListView.module.scss';

interface BountiesListViewProps {
  dao: DAO;
  tokens: Tokens;
  accountId: string;
  bountiesContext: BountyContext[];
  completeHandler: (
    id: string,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void;
}

export const BountiesListView: FC<BountiesListViewProps> = ({ dao }) => {
  const pending = [];
  const inProgress = [];
  const completed = [];

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <CollapsableSection
          status="Pending"
          title={`Coming Soon (Proposal Phase) (${pending.length})`}
          contentTitle="Voting"
          daoId={dao.id}
          data={[]}
        />
        <CollapsableSection
          status="InProgress"
          title={`Bounties (${inProgress.length})`}
          contentTitle="Claims (Available / Total)"
          daoId={dao.id}
          data={[]}
        />
        <CollapsableSection
          status="Completed"
          title={`Completed (${completed.length})`}
          contentTitle="Claims (Available / Total)"
          daoId={dao.id}
          data={[]}
        />
      </div>
    </div>
  );
};
