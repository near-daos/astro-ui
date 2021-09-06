import React, { FC } from 'react';
import TextTruncate from 'react-text-truncate';
import { Bounty } from 'components/cards/bounty-card/types';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import styles from 'components/cards/bounty-card/bounty-card.module.scss';

export interface BountyInfoCardProps {
  data: Bounty;
}

export const BountyInfoCard: FC<BountyInfoCardProps> = ({ data }) => {
  const { token, amount, group } = data;

  return (
    <div className={cn(styles.root, styles.simple)}>
      <div className={cn(styles.type, styles.passed)}>
        <Icon name="proposalBounty" className={styles.icon} />
      </div>
      <div className={styles.content}>
        <div className={styles.group}>
          <TextTruncate
            line={3}
            element="span"
            truncateText="…"
            text={group}
            textTruncateChild={null}
          />
        </div>
        <div className={styles.reward}>
          <span className={styles.value}>{amount}</span>
          &nbsp;
          <span className={styles.valueDesc}>{token}</span>
        </div>
      </div>
    </div>
  );
};
