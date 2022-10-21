import React, { FC, useState } from 'react';
import cn from 'classnames';
import { AnimatePresence } from 'framer-motion';

import { SectionItem } from 'astro_2.0/features/Bounties/components/BountiesListView/types';

import { SectionRow } from 'astro_2.0/features/Bounties/components/BountiesListView/components/SectionRow';
import { IconButton } from 'components/button/IconButton';

import { DAO } from 'types/dao';

import styles from './CollpasableSection.module.scss';

interface CollapsableSectionProps {
  title: string;
  contentTitle: string;
  dao: DAO;
  data: SectionItem[];
  status: 'Pending' | 'InProgress' | 'Completed';
  accountId: string;
}

export const CollapsableSection: FC<CollapsableSectionProps> = ({
  title,
  contentTitle,
  dao,
  data,
  status,
  accountId,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.root}>
      <div
        className={cn(styles.header, {
          [styles.pending]: status === 'Pending',
          [styles.inProgress]: status === 'InProgress',
          [styles.completed]: status === 'Completed',
        })}
      >
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
        <div className={styles.proposer}>Proposer</div>
        <div className={styles.content}>{contentTitle}</div>
      </div>
      <AnimatePresence>
        {open &&
          data.map((item, i) => {
            return (
              <SectionRow
                id={item.id}
                key={item.id}
                accountId={accountId}
                dao={dao}
                isFirstRow={i === 0}
                item={item}
                status={status}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
};
