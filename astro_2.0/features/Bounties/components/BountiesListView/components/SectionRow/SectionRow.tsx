import React, { FC, useState } from 'react';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { SectionItem } from 'astro_2.0/features/Bounties/components/BountiesListView/types';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ClaimRow } from 'astro_2.0/features/Bounties/components/BountiesListView/components/ClaimRow';

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
  const router = useRouter();
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
          [styles.pending]: status === 'Pending',
          [styles.inProgress]: status === 'InProgress',
          [styles.completed]: status === 'Completed',
        })}
      >
        <div className={cn(styles.rowTitle)}>
          <Button
            size="block"
            variant="transparent"
            disabled={!item.bounty?.bountyClaims.length}
            onClick={() =>
              !!item.bounty?.bountyClaims.length && setShowClaims(prev => !prev)
            }
          >
            <div
              className={cn(styles.singleLine, styles.flex, styles.toggleLink, {
                [styles.disabled]: !item.bounty?.bountyClaims.length,
              })}
            >
              <div className={styles.singleLine}>{item.title}</div>
              <div className={styles.flex}>
                {!!item.bounty?.bountyClaims.length && (
                  <Icon
                    name={showClaims ? 'buttonArrowUp' : 'buttonArrowDown'}
                    className={cn(styles.drilldownIcon, {
                      [styles.open]: showClaims,
                    })}
                  />
                )}
              </div>
            </div>
          </Button>
        </div>

        <div className={styles.rowProposer}>
          <div className={styles.singleLine}>{item.proposer}</div>
        </div>
        <div className={styles.rowContent}>{item.content}</div>
        <div className={cn(styles.rowDetails)}>
          <Button
            size="small"
            variant="secondary"
            className={styles.detailsButton}
            onClick={() => router.push(item.link)}
          >
            <div className={styles.singleLine}>Details</div>
          </Button>
        </div>
      </motion.div>
      <AnimatePresence>
        {showClaims &&
          (!!item.bounty?.bountyClaims.length ||
            !!item.bounty?.bountyDoneProposals.length) && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.claimsContainer}
            >
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
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
};
