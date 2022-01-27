import React, { FC, useState } from 'react';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { SectionItem } from 'astro_2.0/features/Bounties/components/BountiesListView/types';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ClaimRow } from 'astro_2.0/features/Bounties/components/BountiesListView/components/ClaimRow';

import {
  SINGLE_BOUNTY_PAGE_URL,
  SINGLE_PROPOSAL_PAGE_URL,
} from 'constants/routing';

import { DAO } from 'types/dao';

import styles from 'astro_2.0/features/Bounties/components/BountiesListView/components/CollapsableSection/CollpasableSection.module.scss';

interface SectionRowProps {
  id: string;
  isFirstRow: boolean;
  status: string;
  item: SectionItem;
  dao: DAO;
  accountId: string;
}

export const SectionRow: FC<SectionRowProps> = ({
  isFirstRow,
  status,
  item,
  dao,
  accountId,
}) => {
  const [showClaims, setShowClaims] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(styles.row, {
          [styles.firstRow]: isFirstRow,
        })}
      >
        <div
          className={cn(styles.rowTitle, {
            [styles.pending]: status === 'Pending',
            [styles.inProgress]: status === 'InProgress',
            [styles.completed]: status === 'Completed',
          })}
        >
          <Link
            href={{
              pathname: SINGLE_BOUNTY_PAGE_URL,
              query: {
                dao: dao.id,
                bounty: item.id,
              },
            }}
          >
            <a>
              <div className={styles.singleLine}>{item.title}</div>
            </a>
          </Link>
        </div>
        <div className={styles.rowLink}>
          <Link
            href={{
              pathname: SINGLE_PROPOSAL_PAGE_URL,
              query: {
                dao: dao.id,
                proposal: item.proposalId,
              },
            }}
          >
            <a className={styles.proposalLink}>
              <Icon name="buttonExternal" className={styles.icon} />
            </a>
          </Link>

          {item.bounty && (
            <Button
              size="small"
              variant="transparent"
              disabled={!item.bounty?.bountyClaims.length}
              onClick={() =>
                !!item.bounty?.bountyClaims.length &&
                setShowClaims(prev => !prev)
              }
              className={cn(styles.toggleClaims, {
                [styles.active]: showClaims,
              })}
            >
              <Icon name="claimsLink" className={styles.icon} />
              <span className={styles.slotsWrapper}>
                <span className={styles.slotActive}>
                  {item.bounty.numberOfClaims}
                </span>
                /<span className={styles.slot}>{item.bounty.times}</span>
              </span>
            </Button>
          )}
        </div>
        <div className={styles.rowProposer}>
          <div className={styles.singleLine}>{item.proposer}</div>
        </div>
        <div className={styles.rowContent}>{item.content}</div>
      </motion.div>
      {showClaims && !!item.bounty?.bountyClaims.length && (
        <div className={styles.claimsContainer}>
          {item.bounty?.bountyClaims.map(claim => {
            if (!item.bounty) {
              return null;
            }

            const claimedByMe = !!item.bounty.bountyClaims.find(
              _claim => _claim.accountId === accountId
            );

            return (
              <ClaimRow
                maxDeadline={item.bounty.maxDeadline}
                key={claim.id}
                dao={dao}
                bounty={item.bounty}
                data={claim}
                completeHandler={item.completeHandler}
                doneProposals={item.bounty?.bountyDoneProposals}
                claimedByMe={claimedByMe}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
