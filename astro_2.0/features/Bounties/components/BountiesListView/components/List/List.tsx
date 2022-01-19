import React, { FC } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import useQuery from 'hooks/useQuery';

import { PhaseCell } from 'astro_2.0/features/Bounties/components/BountiesListView/components/List/components/PhaseCell';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { mapBountyToCardContent } from 'astro_2.0/components/BountyCard/helpers';
import { getBountyDoneProposal } from 'astro_2.0/features/Bounties/helpers';
import { BountiesPhase, Bounty, BountyStatus } from 'types/bounties';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import { DAO } from 'types/dao';
import { Proposal } from 'types/proposal';

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
  bountyDoneProposals: Proposal[];
}

export const List: FC<ListProps> = ({
  bounties,
  dao,
  tokens,
  accountId,
  bountyDoneProposals,
}) => {
  const { query } = useQuery<{
    bountyStatus: BountyStatus;
    bountySort: string;
  }>();

  return (
    <div className={styles.root}>
      <Header />
      {bounties?.flatMap(bounty => {
        const content = mapBountyToCardContent(
          dao,
          bounty,
          tokens,
          accountId,
          query.bountyStatus
        );

        return content.map(singleContent => {
          const cardContent = {
            ...singleContent,
          };

          const bountyDoneProposal = getBountyDoneProposal(
            cardContent,
            bountyDoneProposals
          );

          if (bountyDoneProposal) {
            cardContent.status = BountyStatus.PendingApproval;
          }

          return (
            <div className={cn(styles.listElement, styles.listItem)}>
              <PhaseCell phase={BountiesPhase.Available} />
              <div className={styles.nameCell}>{cardContent.description}</div>
              <div className={styles.proposerCell}>proposer</div>
              <div className={styles.linkCell}>
                <Link
                  href={{
                    pathname: SINGLE_PROPOSAL_PAGE_URL,
                    query: {
                      dao: dao.id,
                      proposal: 1,
                    },
                  }}
                >
                  <a className={styles.proposalLink}>
                    <Icon name="buttonExternal" className={styles.icon} />
                  </a>
                </Link>
              </div>
              <div className={styles.claimsCell}>
                <span>
                  <span className={styles.slotActive}>{cardContent.slots}</span>
                  <span className={styles.slot}>
                    {' '}
                    / {cardContent.slotsTotal}
                  </span>
                </span>
                <Button size="small" className={styles.claimsButton}>
                  Claim
                </Button>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};
