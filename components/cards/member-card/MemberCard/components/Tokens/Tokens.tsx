import cn from 'classnames';
import React, { FC } from 'react';

import { Token } from 'components/cards/member-card/types';

import styles from 'components/cards/member-card/MemberCard/MemberCard.module.scss';

interface TokensProps {
  data?: Token;
}

export const Tokens: FC<TokensProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const { value, type, percent } = data;

  return (
    <div className={styles.footerItem}>
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
