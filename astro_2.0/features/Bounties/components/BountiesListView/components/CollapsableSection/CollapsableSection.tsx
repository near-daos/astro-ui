import React, { FC, ReactNode, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import { Icon } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import styles from './CollpasableSection.module.scss';

type SectionItem = {
  title: string;
  proposer: string;
  proposalId: string;
  content: ReactNode;
};

interface CollapsableSectionProps {
  title: string;
  contentTitle: string;
  daoId: string;
  data: SectionItem[];
  status: 'Pending' | 'InProgress' | 'Completed';
}

export const CollapsableSection: FC<CollapsableSectionProps> = ({
  title,
  contentTitle,
  daoId,
  data,
  status,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div
          className={cn(styles.title, {
            [styles.pending]: status === 'Pending',
            [styles.inProgress]: status === 'InProgress',
            [styles.completed]: status === 'Completed',
          })}
        >
          <div className={styles.control}>
            <IconButton
              icon="buttonArrowDown"
              onClick={() => setOpen(prev => !prev)}
              iconProps={{
                className: cn(styles.controlIcon, {
                  [styles.open]: open,
                }),
              }}
            />
          </div>
          {title}
        </div>
        <div className={styles.link} />
        <div className={styles.proposer}>Proposer</div>
        <div className={styles.content}>{contentTitle}</div>
      </div>
      <AnimatePresence>
        {open &&
          data.map((item, i) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(styles.row, {
                  [styles.firstRow]: i === 0,
                })}
              >
                <div
                  className={cn(styles.rowTitle, {
                    [styles.pending]: status === 'Pending',
                    [styles.inProgress]: status === 'InProgress',
                    [styles.completed]: status === 'Completed',
                  })}
                >
                  <div className={styles.singleLine}>{item.title}</div>
                </div>
                <div className={styles.rowLink}>
                  <Link
                    href={{
                      pathname: SINGLE_PROPOSAL_PAGE_URL,
                      query: {
                        dao: daoId,
                        proposal: item.proposalId,
                      },
                    }}
                  >
                    <a className={styles.proposalLink}>
                      <Icon name="buttonExternal" className={styles.icon} />
                    </a>
                  </Link>
                </div>
                <div className={styles.rowProposer}>
                  <div className={styles.singleLine}>{item.proposer}</div>
                </div>
                <div className={styles.rowContent}>{item.content}</div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
};
