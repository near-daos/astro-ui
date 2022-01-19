import React, { FC } from 'react';

import { BountiesPhase, Bounty } from 'types/bounties';

import { LegendItem } from 'astro_2.0/features/Bounties/components/LegendItem';
import { List } from 'astro_2.0/features/Bounties/components/BountiesListView/components/List';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { DAO } from 'types/dao';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { Proposal } from 'types/proposal';

import styles from './BountiesListView.module.scss';

interface BountiesListViewProps {
  bounties?: Bounty[];
  dao: DAO;
  tokens: Tokens;
  accountId: string;
  bountyDoneProposals: Proposal[];
}

export const BountiesListView: FC<BountiesListViewProps> = ({
  bounties,
  dao,
  tokens,
  accountId,
  bountyDoneProposals,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.legend}>
        <LegendItem
          label="Coming soon (Proposal Phase)"
          phase={BountiesPhase.ComingSoon}
        />
        <LegendItem label="Available bounty" phase={BountiesPhase.Available} />
        <LegendItem label="In progress" phase={BountiesPhase.InProgress} />
        <LegendItem label="Completed" phase={BountiesPhase.Completed} />
      </div>
      <div className={styles.content}>
        {!bounties?.length ? (
          <NoResultsView title="No bounties available" />
        ) : (
          <List
            bounties={bounties}
            dao={dao}
            tokens={tokens}
            accountId={accountId}
            bountyDoneProposals={bountyDoneProposals}
          />
        )}
      </div>
    </div>
  );
};
