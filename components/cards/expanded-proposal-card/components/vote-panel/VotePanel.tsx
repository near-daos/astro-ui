import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';

import { Button } from 'components/button/Button';
// import { Checkbox } from 'components/checkbox/Checkbox';

import { ProposalVotingPermissions } from 'types/proposal';

import styles from './vote-panel.module.scss';

type Vote = {
  vote: 'yes' | 'no' | null;
  // reportSpam: boolean;
};

interface VotePanelProps {
  onSubmit: (vote: Vote) => void;
  disabled: boolean;
  permissions: ProposalVotingPermissions;
}

export const VotePanel: FC<VotePanelProps> = ({
  onSubmit,
  disabled,
  permissions
}) => {
  const { canApprove, canReject } = permissions;

  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  // const [reportSpam, setReportSpam] = useState(false);

  const handleSubmit = useCallback(() => {
    onSubmit({ vote /* reportSpam */ });
  }, [vote, /* reportSpam, */ onSubmit]);

  function renderReportSpam() {
    // return (
    //   <div className={styles.row}>
    //     <Checkbox
    //       disabled={disabled}
    //       selected={reportSpam}
    //       label="Report spam"
    //       onClick={() => setReportSpam(!reportSpam)}
    //     />
    //   </div>
    // );

    return null;
  }

  return (
    <div
      className={cn(styles.root, {
        [styles.disabled]: disabled
      })}
    >
      <div className={styles.row}>
        <div className={styles.left}>
          <Button
            disabled={disabled || !canApprove}
            onClick={() => !disabled && setVote('yes')}
            variant="secondary"
            size="small"
            className={cn(styles.yes, { [styles.selected]: vote === 'yes' })}
          >
            Yes
          </Button>
          <Button
            disabled={disabled || !canReject}
            onClick={() => !disabled && setVote('no')}
            variant="secondary"
            size="small"
            className={cn(styles.no, { [styles.selected]: vote === 'no' })}
          >
            No
          </Button>
        </div>
        <div
          className={cn(styles.right, {
            [styles.disabled]: !vote /* || !reportSpam */
          })}
        >
          <Button
            size="small"
            onClick={handleSubmit}
            disabled={!vote /* && !reportSpam */ || disabled}
          >
            Vote
          </Button>
        </div>
      </div>
      {renderReportSpam()}
    </div>
  );
};
