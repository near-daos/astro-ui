import React, { FC } from 'react';

import { BountyContext } from 'types/bounties';
import { DAO } from 'types/dao';

import { ViewBounty } from 'astro_2.0/features/ViewBounty';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';

import { Tokens } from 'context/CustomTokensContext';

import styles from 'pages/dao/[dao]/tasks/bounties/[bounty]/BountyPage.module.scss';

interface BountiesFeedProps {
  data: BountyContext[];
  dao: DAO;
  tokens: Tokens;
}

export const BountiesFeed: FC<BountiesFeedProps> = ({ data, dao, tokens }) => {
  if (!data.length) {
    return <NoResultsView title="No results found" />;
  }

  return (
    <div>
      {data.map(bountyContext => {
        const { bounty, proposal, commentsCount } = bountyContext;

        return (
          <ViewBounty
            contextId={bountyContext.id}
            dao={dao}
            bounty={bounty}
            proposal={proposal}
            tokens={tokens}
            commentsCount={commentsCount}
            className={styles.bountyInfo}
            initialInfoPanelView={null}
          />
        );
      })}
    </div>
  );
};
