import React from 'react';
import cn from 'classnames';

import { BountyStatus } from 'types/bounties';
import { TooltipMessageSeverity } from 'astro_2.0/components/InfoBlockWidget/types';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { getDistanceFromNow } from 'astro_2.0/components/BountyCard/helpers';
import { CardFooter } from 'astro_2.0/components/BountyCard/components/CardFooter';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';

import { formatYoktoValue } from 'helpers/format';

import styles from './BountyActionsBar.module.scss';

interface BountyActionsBarProps {
  canClaim: boolean;
  bountyBond: string;
  forgivenessPeriod: string;
  bountyStatus: BountyStatus;
  claimHandler: () => void;
  unclaimHandler: () => void;
  completeHandler: () => void;
}

export const BountyActionsBar: React.FC<BountyActionsBarProps> = ({
  bountyStatus,
  bountyBond,
  forgivenessPeriod,
  claimHandler,
  unclaimHandler,
  completeHandler,
  canClaim,
}) => {
  const [, graceValue, graceTimeUnit] = getDistanceFromNow(
    forgivenessPeriod
  ).split(' ');

  const tooltipSeverity = {
    [BountyStatus.Available]: TooltipMessageSeverity.Info,
    [BountyStatus.InProgress]: TooltipMessageSeverity.Positive,
    [BountyStatus.InProgressByMe]: TooltipMessageSeverity.Positive,
    [BountyStatus.Expired]: TooltipMessageSeverity.Warning,
    [BountyStatus.PendingApproval]: TooltipMessageSeverity.Info,
  };

  function renderButtons() {
    if (bountyStatus === 'Available') {
      if (canClaim) {
        return (
          <Button
            variant="black"
            size="small"
            onClick={claimHandler}
            className={cn(styles.claim, styles.button)}
          >
            Claim
          </Button>
        );
      }

      return <div className={styles.stub} />;
    }

    return (
      <>
        <Button
          variant="secondary"
          size="small"
          onClick={unclaimHandler}
          className={cn(styles.unclaim, styles.button)}
        >
          Unclaim
        </Button>

        <Button
          variant="black"
          size="small"
          onClick={completeHandler}
          className={cn(styles.complete, styles.button)}
        >
          Complete
        </Button>
      </>
    );
  }

  return (
    <CardFooter>
      <InfoBlockWidget
        label="Bond"
        value={
          <InfoValue value={formatYoktoValue(bountyBond, 24)} label="NEAR" />
        }
        tooltip={
          bountyStatus !== BountyStatus.Expired ? (
            <span>
              To prevent spam, you must pay a bond. The bond will be returned
              when you complete the bounty before your deadline.
            </span>
          ) : (
            <span>
              Your breached deadline period. The bond will not be reimbursed by
              DAO
            </span>
          )
        }
        messageSeverity={tooltipSeverity[bountyStatus]}
      />
      {bountyStatus === 'Available' && (
        <InfoBlockWidget
          label="Grace"
          value={<InfoValue value={graceValue} label={graceTimeUnit} />}
          tooltip={
            <span>
              You can unclaim a bounty for the next &nbsp;
              <b>
                {graceValue} &nbsp; {graceTimeUnit}
              </b>
              . If you miss your deadline, you will lose your bond.
            </span>
          }
          messageSeverity={TooltipMessageSeverity.Info}
        />
      )}
      {renderButtons()}
    </CardFooter>
  );
};
