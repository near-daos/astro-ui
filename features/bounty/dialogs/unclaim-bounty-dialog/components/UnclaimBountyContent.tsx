import React, { FC } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import cn from 'classnames';

import { BountyInfoCard } from 'components/cards/bounty-info-card';
import { Bounty } from 'components/cards/bounty-card/types';
import styles from 'features/bounty/dialogs/bounty-dialogs.module.scss';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

interface UnclaimBountyContentProps {
  onClose: (...args: unknown[]) => void;
  onSubmit: () => void;
  data: Bounty;
}

type ActionStatus = 'error' | 'success';

const UnclaimBountyContent: FC<UnclaimBountyContentProps> = ({
  data,
  onClose,
  onSubmit
}) => {
  const startDate = parseISO(data.claimedBy[0]?.starTime);

  const status: ActionStatus =
    differenceInCalendarDays(startDate, new Date()) > 2 ? 'error' : 'success';

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <BountyInfoCard data={data} />
      </div>
      <div
        className={cn(styles.warning, {
          [styles.success]: status === 'success',
          [styles.error]: status === 'error'
        })}
      >
        <Icon name="buttonAlert" className={cn(styles.icon, styles.mr8)} />
        {status === 'success' && (
          <p>
            You can unclaiming withing the grace period and{' '}
            <b>will get your bond back</b>.
          </p>
        )}
        {status === 'error' && (
          <p>
            You can unclaiming after the grace period and{' '}
            <b>will not get your bond back</b>.
          </p>
        )}
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
          Unclaim
        </Button>
      </div>
    </div>
  );
};

export default UnclaimBountyContent;
