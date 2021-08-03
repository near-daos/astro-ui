import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import styles from './member-card.module.scss';

type Token = {
  value: number;
  type: string;
  percent: number;
};

export interface MemberCardProps {
  children: ReactNode;
  title: string;
  tokens?: Token;
  votes: number;
}

interface TokensProps {
  data?: Token;
}

const Tokens: FC<TokensProps> = ({ data }) => {
  if (!data) return null;

  const { value, type, percent } = data;

  return (
    <div className={styles['footer-item']}>
      <div className={cn(styles.label, 'subtitle4')}>Tokens</div>
      <div className={styles.inline}>
        <span className={cn(styles.value, 'title2')}>
          {value} {type}
        </span>
        <span className={cn(styles.label, 'title4')}>{percent}%</span>
      </div>
    </div>
  );
};

const MemberCard: FC<MemberCardProps> = ({
  title,
  children,
  votes,
  tokens
}) => {
  return (
    <div className={styles.root}>
      <div className={styles['person-icon']}>
        <Icon name="proposalRemoveMember" width={24} height={24} />
      </div>

      <div className={styles.body}>
        <div className={styles.smile}>
          <svg className={styles['smile-stroke']}>
            <circle r={20} cx={32} cy={32} />
          </svg>
        </div>
        <div className={cn(styles.title, 'title1')}>{title}</div>
        <div className={styles.tags}>{children}</div>
      </div>

      <div className={styles.footer}>
        <Tokens data={tokens} />
        <div className={styles['footer-item']}>
          <span className={cn(styles.label, 'subtitle4')}>Votes casted</span>
          <div className={styles.inline}>
            <span className={cn(styles.value, 'title2')}>{votes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
