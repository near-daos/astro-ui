import React, { FC, useState } from 'react';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import { Icon, IconName } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './TimelineLegend.module.scss';

export const TimelineLegend: FC = () => {
  const [open, setOpen] = useState(true);

  function renderContentItem(icon: IconName, label: string) {
    return (
      <span className={styles.iconWrapper}>
        <Icon name={icon} className={styles.icon} />
        <span className={styles.label}>{label}</span>
      </span>
    );
  }

  return (
    <div className={styles.root}>
      <Button
        variant="transparent"
        size="block"
        onClick={() => setOpen(!open)}
        className={cn(styles.control, {
          [styles.open]: open,
        })}
      >
        <Icon
          name="arrow"
          className={cn(styles.controlIcon, {
            [styles.open]: open,
          })}
        />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0, transform: 'translateX(-12px)' }}
            animate={{ opacity: 1, transform: 'translateX(0px)' }}
            exit={{ opacity: 0, transform: 'translateX(-12px)' }}
            className={cn(styles.content, {
              [styles.open]: open,
            })}
          >
            {renderContentItem('bountyProposalCreated', 'Proposal Created')}
            {renderContentItem('bountyCreated', 'Bounty Created')}
            {renderContentItem('bountyCreateClaim', 'Claim')}
            {renderContentItem('bountyPendingApproval', 'Pending Approval')}
            {renderContentItem('bountyDeadlineClaim', 'Claim Deadline')}
            {renderContentItem('bountyCompleteBounty', 'Complete Bounty')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
