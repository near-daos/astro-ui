import React from 'react';
import cn from 'classnames';
import { SubmitHandler, useFormContext } from 'react-hook-form';

import { BountyStatus } from 'types/bounties';
import { TooltipMessageSeverity } from 'astro_2.0/components/InfoBlockWidget/types';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { getDistanceFromNow } from 'astro_2.0/components/BountyCard/helpers';
import { CardFooter } from 'astro_2.0/components/BountyCard/components/CardFooter';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';

import { formatYoktoValue } from 'utils/format';

import styles from './BountyActionsBar.module.scss';

interface BountyActionsBarProps {
  claimedByCurrentUser: boolean;
  bountyBond: string;
  forgivenessPeriod: string;
  bountyStatus: BountyStatus;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  unclaimHandler: SubmitHandler<any>;
  completeHandler: SubmitHandler<any>;
}

export const BountyActionsBar: React.FC<BountyActionsBarProps> = ({
  claimedByCurrentUser,
  bountyStatus,
  bountyBond,
  forgivenessPeriod,
  unclaimHandler,
  completeHandler,
}) => {
  const { handleSubmit } = useFormContext();
  const timeDistance = getDistanceFromNow(forgivenessPeriod).split(' ');

  let graceValue;
  let graceTimeUnit;

  if (timeDistance.length === 2) {
    // eslint-disable-next-line prefer-destructuring
    graceValue = timeDistance[0];
    // eslint-disable-next-line prefer-destructuring
    graceTimeUnit = timeDistance[1];
  } else {
    graceValue = `${timeDistance[0]} ${timeDistance[1]}`;
    // eslint-disable-next-line prefer-destructuring
    graceTimeUnit = timeDistance[2];
  }

  const tooltipSeverity = {
    [BountyStatus.Available]: TooltipMessageSeverity.Info,
    [BountyStatus.NotClaimAvailable]: TooltipMessageSeverity.Info,
    [BountyStatus.InProgress]: TooltipMessageSeverity.Positive,
    [BountyStatus.InProgressByMe]: TooltipMessageSeverity.Positive,
    [BountyStatus.Expired]: TooltipMessageSeverity.Warning,
    [BountyStatus.PendingApproval]: TooltipMessageSeverity.Info,
  };

  function renderButtons() {
    if (bountyStatus === BountyStatus.Available) {
      return (
        <div className={styles.buttonsWrapper}>
          <Button
            variant="black"
            size="small"
            type="submit"
            className={cn(styles.claim, styles.button)}
          >
            Claim
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.buttonsWrapper}>
        {claimedByCurrentUser && (
          <Button
            variant="secondary"
            size="small"
            type="submit"
            onClick={handleSubmit(unclaimHandler)}
            className={cn(styles.unclaim, styles.button)}
          >
            Unclaim
          </Button>
        )}

        <Button
          variant="black"
          size="small"
          onClick={handleSubmit(completeHandler)}
          className={cn(styles.complete, styles.button)}
        >
          Complete
        </Button>
      </div>
    );
  }

  return (
    <CardFooter>
      <InfoBlockWidget
        className={styles.actionBarItem}
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
          className={styles.actionBarItem}
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
