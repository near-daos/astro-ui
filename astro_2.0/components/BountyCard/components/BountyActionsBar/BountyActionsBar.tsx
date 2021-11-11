import React from 'react';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Button } from 'components/button/Button';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';
import { formatYoktoValue } from 'helpers/format';
import { getDistanceFromNow } from 'astro_2.0/components/BountyCard/helpers';
import { TooltipMessageSeverity } from 'astro_2.0/components/InfoBlockWidget/types';
import { BountyStatus } from 'astro_2.0/components/BountyCard/types';
import styles from './BountyActionsBar.module.scss';

interface BountyActionsBarProps {
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
}) => {
  const [, graceValue, graceTimeUnit] = getDistanceFromNow(
    forgivenessPeriod
  ).split(' ');

  const tooltipSeverity = {
    [BountyStatus.Available]: TooltipMessageSeverity.Info,
    [BountyStatus.InProgress]: TooltipMessageSeverity.Positive,
    [BountyStatus.Expired]: TooltipMessageSeverity.Warning,
  };

  return (
    <div className={styles.root}>
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
      {bountyStatus === 'Available' ? (
        <Button variant="black" size="medium" onClick={claimHandler}>
          Claim
        </Button>
      ) : (
        <>
          <Button variant="secondary" size="small" onClick={unclaimHandler}>
            Unclaim
          </Button>

          <Button variant="black" size="small" onClick={completeHandler}>
            Complete
          </Button>
        </>
      )}
    </div>
  );
};
