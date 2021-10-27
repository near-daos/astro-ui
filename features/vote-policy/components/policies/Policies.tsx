import classNames from 'classnames';
import difference from 'lodash/difference';

import React from 'react';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import styles from 'features/vote-policy/components/policies/policies.module.scss';
import commonStyles from 'features/vote-policy/components/common.module.scss';

import {
  PolicyRow,
  VotePolicy,
} from 'features/vote-policy/components/policy-row/PolicyRow';

const headerValues = {
  'Who can vote': commonStyles.whoCanVote,
  'Vote by': commonStyles.voteBy,
  Threshold: commonStyles.amount,
};

interface PoliciesProps {
  policies: VotePolicy[];
  groups: string[];
  tokens: string[];
  onAdd: () => void;
  onRemove: (index: number) => () => void;
  onUpdate: (index: number, item: VotePolicy) => void;
}

export const Policies: React.FC<PoliciesProps> = ({
  policies,
  groups,
  tokens,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  const selectedGroups = policies.map(item => item.whoCanVote ?? '');

  return (
    <>
      <div
        className={classNames(commonStyles.row, styles.header, styles.title)}
      >
        {Object.entries(headerValues).map(entry => {
          const [header, style] = entry;

          return (
            <div className={classNames(commonStyles.title, style)} key={header}>
              {header}
            </div>
          );
        })}
      </div>
      {policies.map((policy, index) => (
        <PolicyRow
          key={policy.whoCanVote}
          selectedGroups={selectedGroups}
          policy={policy}
          groups={groups}
          tokens={tokens}
          updatePolicyHandler={v => onUpdate(index, v)}
          removePolicyHandler={onRemove(index)}
        />
      ))}
      <Button
        disabled={difference(groups, selectedGroups).length === 0}
        className={styles.add}
        variant="tertiary"
        onClick={onAdd}
        size="small"
      >
        <Icon name="buttonAdd" className={styles.icon} />
        <div className={styles.caption}>Add</div>
      </Button>
    </>
  );
};
