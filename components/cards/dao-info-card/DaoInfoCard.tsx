import * as Typography from 'components/Typography';
import React, { FC } from 'react';

import Link from 'next/link';
import styles from './dao-info.module.scss';

export interface DaoInfoCardProps {
  items: { label: string; value: string; link?: string }[];
}

export const DaoInfoCard: FC<DaoInfoCardProps> = ({ items }) => (
  <div className={styles.root}>
    {items.map(item => (
      <div key={item.label}>
        <Typography.Subtitle className={styles.title} size={6}>
          {item.label}
        </Typography.Subtitle>
        <Typography.Title className={styles.subtitle} size={3}>
          {item.link ? (
            <Link href={item.link}>
              <a>{item.value}</a>
            </Link>
          ) : (
            item.value
          )}
        </Typography.Title>
      </div>
    ))}
  </div>
);
