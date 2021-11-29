import React, { FC } from 'react';
import TextTruncate from 'react-text-truncate';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import styles from 'components/cards/bounty-card/bounty-card.module.scss';
import { Token } from 'types/token';
import { TokenWidget } from 'components/token';
import { Bounty } from 'types/bounties';

export interface BountyInfoCardProps {
  data: Bounty;
  token: Token;
}

export const BountyInfoCard: FC<BountyInfoCardProps> = ({ data, token }) => {
  const { amount, description } = data;

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
            text={description}
            textTruncateChild={null}
          />
        </div>
        <TokenWidget token={token} amount={amount} />
      </div>
    </div>
  );
};
