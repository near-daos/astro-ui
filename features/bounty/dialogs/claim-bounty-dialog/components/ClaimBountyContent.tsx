import React, { FC } from 'react';
import { format, parseISO } from 'date-fns';

import { Bounty } from 'features/bounty/types';
import { BountyCard } from 'components/cards/bounty-card';
import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import { getDeadlineDate } from 'components/cards/bounty-card/helpers';
import { Button } from 'components/button/Button';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { Bond } from 'components/bond';

interface ClaimBountyContentProps {
  onClose: (...args: unknown[]) => void;
  onSubmit: () => void;
  data: Bounty;
}

const ClaimBountyContent: FC<ClaimBountyContentProps> = ({
  data,
  onClose,
  onSubmit
}) => {
  const startDate = parseISO(data.claimedBy[0]?.datetime);
  const deadline = getDeadlineDate(
    startDate,
    data.deadlineThreshold,
    data.deadlineUnit
  );

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <BountyCard variant="simple" data={data} />
      </div>
      <div className={styles.deadline}>
        <div className={styles.label}>Deadline</div>
        <div className={styles.value}>
          {format(deadline, 'dd.LL.yyyy')} at {format(deadline, 'hh:mm z')}
        </div>
        <p>
          You can unclaim a bounty for the next <b>2 days</b>. After that, if
          you miss your deadline, you will loose your bond.
        </p>
      </div>
      <div className={styles.vote}>
        <ExpandableDetails label="Details">Placeholder</ExpandableDetails>
        <Bond {...data.bondDetail} className={styles.fitContainer} />
      </div>

      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onClose}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          size="small"
          className={styles.ml8}
        >
          Claim
        </Button>
      </div>
    </div>
  );
};

export default ClaimBountyContent;
