import React from 'react';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Button } from 'components/button/Button';
import { BountyStatus } from 'components/cards/bounty-card/types';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';
import styles from './BountyActionsBar.module.scss';

interface BountyActionsBarProps {
  daoId: string;
  bountyId: string;
  bountyBond: string;
  forgivenessPeriod: string;
  bountyStatus: BountyStatus;
  currentUser: string;
  deadlineThreshold: string;
  proposalBond: string;
}

export const BountyActionsBar: React.FC<BountyActionsBarProps> = ({
  bountyStatus,
  bountyBond,
}) => {
  return (
    <div className={styles.root}>
      <InfoBlockWidget
        label="Bond"
        value={<InfoValue value={bountyBond} label="NEAR" />}
        tooltipText="You can unclaim a bounty for the next 2 days. If you miss your deadline, you will lose your bond."
        messageSeverity="Info"
      />
      <InfoBlockWidget
        label="Grace"
        value={<InfoValue value={bountyBond} label="Hours" />}
        tooltipText="You can unclaim a bounty for the next 2 days. If you miss your deadline, you will lose your bond."
        messageSeverity="Info"
      />
      {bountyStatus === 'Available' ? (
        <Button variant="black" size="medium">
          {/* onClick={proposeBountyDoneHandler()} */}
          Claim
        </Button>
      ) : (
        <>
          <Button
            variant="secondary"
            size="medium"
            // onClick={unclaimBountyHandler(daoId, bountyId)}
          >
            Unclaim
          </Button>

          <Button variant="black" size="small">
            {/* onClick={proposeBountyDoneHandler()} */}
            Purpose
          </Button>
        </>
      )}
    </div>
  );
};
