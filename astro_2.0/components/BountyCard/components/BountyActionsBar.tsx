import React, { useCallback } from 'react';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Button } from 'components/button/Button';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';
import { formatYoktoValue } from 'helpers/format';
import {
  getDistanceFromNow,
  getSeverity,
} from 'astro_2.0/components/BountyCard/helpers';
import { TooltipMessageSeverity } from 'astro_2.0/components/InfoBlockWidget/types';
import {
  claimBountyHandler,
  unclaimBountyHandler,
} from 'astro_2.0/components/BountyCard/components/handlers';
import { BountyStatus } from 'astro_2.0/components/BountyCard/types';
import { useRouter } from 'next/router';
import { ProposalVariant } from 'types/proposal';
import styles from './BountyActionsBar.module.scss';

interface BountyActionsBarProps {
  daoId: string;
  bountyId: string;
  bountyBond: string;
  forgivenessPeriod: string;
  bountyStatus: BountyStatus;
  currentUser: string;
  deadlineThreshold: string;
  startTime?: string;
  setBountyData: (bountyId: string, variant: ProposalVariant) => void;
}

export const BountyActionsBar: React.FC<BountyActionsBarProps> = ({
  daoId,
  bountyId,
  bountyStatus,
  bountyBond,
  forgivenessPeriod,
  deadlineThreshold,
  startTime,
  setBountyData,
}) => {
  const [, graceValue, graceTimeUnit] = getDistanceFromNow(
    forgivenessPeriod
  ).split(' ');

  const tooltipSeverity = getSeverity(
    bountyStatus,
    forgivenessPeriod,
    startTime
  );
  const router = useRouter();

  const onSuccessHandler = useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  return (
    <div className={styles.root}>
      <InfoBlockWidget
        label="Bond"
        value={
          <InfoValue value={formatYoktoValue(bountyBond, 24)} label="NEAR" />
        }
        tooltip={
          <span>
            To prevent spam, you must pay a bond. The bond will be returned when
            you complete the bounty before your deadline.
          </span>
        }
        messageSeverity={tooltipSeverity}
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
        <Button
          variant="black"
          size="medium"
          onClick={claimBountyHandler(
            daoId,
            bountyId,
            deadlineThreshold,
            bountyBond,
            onSuccessHandler
          )}
        >
          Claim
        </Button>
      ) : (
        <>
          <Button
            variant="secondary"
            size="small"
            onClick={unclaimBountyHandler(daoId, bountyId, onSuccessHandler)}
          >
            Unclaim
          </Button>

          <Button
            variant="black"
            size="small"
            onClick={() =>
              setBountyData(bountyId, ProposalVariant.ProposeDoneBounty)
            }
          >
            Propose
          </Button>
        </>
      )}
    </div>
  );
};
