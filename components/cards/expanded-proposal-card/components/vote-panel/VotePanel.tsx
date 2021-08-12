import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { Checkbox } from 'components/checkbox/Checkbox';

import styles from './vote-panel.module.scss';

type Vote = {
  vote: 'yes' | 'no' | null;
  reportSpam: boolean;
};

interface VotePanelProps {
  onSubmit: (vote: Vote) => void;
}

export const VotePanel: FC<VotePanelProps> = ({ onSubmit }) => {
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [reportSpam, setReportSpam] = useState(false);

  const handleSubmit = useCallback(() => {
    onSubmit({ vote, reportSpam });
  }, [vote, reportSpam, onSubmit]);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.left}>
          <Button
            onClick={() => setVote('yes')}
            variant="secondary"
            size="small"
            className={cn(styles.yes, { [styles.selected]: vote === 'yes' })}
          >
            Yes
          </Button>
          <Button
            onClick={() => setVote('no')}
            variant="secondary"
            size="small"
            className={cn(styles.no, { [styles.selected]: vote === 'no' })}
          >
            No
          </Button>
        </div>
        <div className={styles.right}>
          <Button size="small" onClick={handleSubmit}>
            Vote
          </Button>
        </div>
      </div>
      <div className={styles.row}>
        <Checkbox
          selected={reportSpam}
          label="Report spam"
          onChange={() => setReportSpam(!reportSpam)}
        />
      </div>
    </div>
  );
};
