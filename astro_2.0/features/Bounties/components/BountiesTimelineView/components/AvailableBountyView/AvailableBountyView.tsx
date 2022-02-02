import { TimelineCardView } from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/TimelineCardView/TimelineCardView';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

import React from 'react';
import { Button } from 'components/button/Button';
import cn from 'classnames';
import styles from 'astro_2.0/features/Bounties/components/BountiesTimelineView/components/AvailableBountyView/AvailableBountyView.module.scss';
import { BountyStatus } from 'types/bounties';
import { TokenWidget } from 'astro_2.0/components/TokenWidget';
import { Token } from 'types/token';

interface AvailabilityBountyViewProps {
  bountyName: string;
  amount: string;
  token: Token;
  claimsOccupied: number;
  claimsAvailable: string;
}

export const AvailabilityBountyView: React.FC<AvailabilityBountyViewProps> = ({
  bountyName,
  amount,
  claimsOccupied,
  claimsAvailable,
  token,
}) => {
  return (
    <TimelineCardView status={BountyStatus.Available}>
      <InfoBlockWidget
        label="Bounty name"
        labelClassName={styles.label}
        value={bountyName}
        valueClassName={styles.value}
      />
      <InfoBlockWidget
        label="Amount"
        labelClassName={styles.label}
        value={
          <TokenWidget
            amount={amount}
            decimals={token.decimals}
            icon={token.icon}
            symbol={token.symbol}
          />
        }
        valueClassName={styles.value}
      />
      <div className={styles.spaceBetween}>
        <InfoBlockWidget
          className={styles.claimsMargin}
          label="Claims"
          labelClassName={styles.label}
          value={
            <div>
              <span>{claimsOccupied}</span>
              <span className={styles.claimsAvailable}>/{claimsAvailable}</span>
            </div>
          }
          valueClassName={styles.value}
        />
        <Button
          variant="black"
          size="small"
          type="submit"
          className={cn(styles.claim, styles.button)}
        >
          Claim
        </Button>
      </div>
    </TimelineCardView>
  );
};
