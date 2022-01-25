import React, { FC } from 'react';
import cn from 'classnames';
import { Bounty, BountyProposal } from 'types/bounties';

import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import { DAO } from 'types/dao';

import styles from './List.module.scss';

const Header = () => (
  <div className={cn(styles.listElement, styles.headerItem)}>
    <div />
    <div>Bounty Name</div>
    <div>Proposer</div>
    <div>Link to proposal</div>
    <div>Claims (Available / Total)</div>
  </div>
);

interface ListProps {
  bounties: Bounty[];
  dao: DAO;
  tokens: Tokens;
  accountId: string;
  bountyProposals: BountyProposal[];
}

export const List: FC<ListProps> = () => {
  return (
    <div className={styles.root}>
      <Header />
    </div>
  );
};
