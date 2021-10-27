import * as Typography from 'components/Typography';
import React, { FC } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import styles from './dao-info.module.scss';

export interface DaoInfoCardProps {
  items: {
    label: string;
    value: string;
    valueType?: string;
    link?: string | null;
  }[];
}

export const DaoInfoCard: FC<DaoInfoCardProps> = ({ items }) => (
  <div className={styles.root}>
    {items.map(item => (
      <div key={item.label}>
        <Typography.Subtitle className={styles.title} size={6}>
          {item.label}
        </Typography.Subtitle>
        <Typography.Title
          className={cn(styles.subtitle, {
            [styles.members]: item.label === 'Members',
          })}
          size={3}
        >
          {item.link ? (
            <Link href={item.link}>
              <a>
                {item.value}
                {item.valueType && (
                  <span className={styles.type}>&nbsp;{item.valueType}</span>
                )}
              </a>
            </Link>
          ) : (
            <>
              {item.value}
              {item.valueType && (
                <span className={styles.type}>&nbsp;{item.valueType}</span>
              )}
            </>
          )}
        </Typography.Title>
      </div>
    ))}
  </div>
);
