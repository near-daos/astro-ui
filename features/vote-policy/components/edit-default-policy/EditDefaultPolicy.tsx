import React, { FC, useCallback } from 'react';
import { Select } from 'components/inputs/select/Select';
import classNames from 'classnames';
import { Input } from 'components/inputs/input/Input';
import { VotePolicy } from 'features/vote-policy/components/policy-row';

import styles from './edit-default-policy.module.scss';

const VOTE_BY = ['Person'];
const THRESHOLDS = ['% of group', 'persons'];
const mapToOptions = (values: string[]) =>
  values.map((value: string) => ({ label: value, value }));

interface EditDefaultPolicyProps {
  policy: VotePolicy;
  onChange: (value: VotePolicy) => void;
}

const EditDefaultPolicy: FC<EditDefaultPolicyProps> = ({
  policy,
  onChange,
}) => {
  const handleChange = useCallback(
    (name: string, value?: string) => {
      onChange({
        ...policy,
        [name]: value,
      });
    },
    [policy, onChange]
  );

  const onVoteByChange = useCallback(
    voteBy => {
      handleChange('voteBy', voteBy);
    },
    [handleChange]
  );

  return (
    <div className={styles.root}>
      <Select
        options={mapToOptions(VOTE_BY)}
        disabled
        placeholder="Vote By"
        onChange={onVoteByChange}
        defaultValue={policy.voteBy}
        className={classNames(styles.voteBy)}
      />
      <Input
        onChange={e =>
          handleChange('amount', (e.target as HTMLInputElement).value)
        }
        placeholder="Amount"
        textAlign="left"
        size="small"
        className={styles.amount}
        defaultValue={policy.amount}
      />
      <Select
        options={mapToOptions(THRESHOLDS)}
        onChange={v => handleChange('threshold', v)}
        defaultValue={policy.threshold}
        placeholder="Threshold"
        disabled
        className={styles.threshold}
      />
      <div className={styles.toPass}>
        <span>to pass</span>
      </div>
    </div>
  );
};

export default EditDefaultPolicy;
