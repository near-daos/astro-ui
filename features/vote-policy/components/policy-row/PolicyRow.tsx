import styles from 'features/vote-policy/components/common.module.scss';
import { DropdownSelect } from 'components/select/DropdownSelect';
import { Group } from 'features/vote-policy/components/group';
import { Select } from 'components/select/Select';
import classNames from 'classnames';
import { Input } from 'components/input/Input';
import { IconButton } from 'components/button/IconButton';
import React, { useCallback, useState } from 'react';

export interface VotePolicy {
  whoCanVote?: string;
  voteBy?: 'Person' | 'Token';
  amount?: number;
  threshold?: string;
}

interface PolicyRowProps {
  policy: VotePolicy;
  groups: string[];
  tokens: string[];
  removePolicyHandler: () => void;
}

export const PolicyRow: React.FC<PolicyRowProps> = ({
  policy,
  groups,
  tokens,
  removePolicyHandler
}) => {
  const VOTE_BY = ['Person', 'Token'];

  const mapToOptions = (values: string[]) =>
    values.map((value: string) => ({ label: value, value }));

  const [thresholds, setThresholds] = useState(
    policy.voteBy === 'Person' ? ['% of group', 'persons'] : tokens
  );

  const onVoteByChange = useCallback(
    voteBy => {
      setThresholds(voteBy === 'Person' ? ['% of group', 'persons'] : tokens);
    },
    [tokens]
  );

  return (
    <div className={styles.row}>
      <DropdownSelect
        label="Who can vote"
        className={styles['who-can-vote']}
        defaultValue={policy.whoCanVote}
        options={groups.map(group => ({
          label: group,
          component: <Group name={group} />
        }))}
      />
      <Select
        options={VOTE_BY.map(value => ({
          label: value,
          value
        }))}
        placeholder="Vote By"
        onChange={onVoteByChange}
        defaultValue={policy.voteBy}
        label="Vote By"
        className={classNames(styles['vote-by'])}
      />
      <Input
        placeholder="Amount"
        textAlign="left"
        label={<span>&nbsp;</span>}
        size="block"
        className={styles.amount}
        defaultValue={policy.amount}
      />
      <Select
        options={mapToOptions(thresholds)}
        label="Threshold"
        defaultValue={policy.threshold}
        placeholder="Threshold"
        className={styles.threshold}
      />
      <div className={styles['to-pass']}>
        <span>to pass</span>
        <IconButton
          icon="buttonDelete"
          size="medium"
          onClick={removePolicyHandler}
        />
      </div>
    </div>
  );
};
