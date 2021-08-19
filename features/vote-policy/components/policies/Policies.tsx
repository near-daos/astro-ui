import classNames from 'classnames';

import React, { useCallback } from 'react';
import { useList } from 'react-use';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import styles from 'features/vote-policy/components/policies/policies.module.scss';
import commonStyles from 'features/vote-policy/components/common.module.scss';

import {
  PolicyRow,
  VotePolicy
} from 'features/vote-policy/components/policy-row/PolicyRow';

const headerValues = {
  'Who can vote': commonStyles['who-can-vote'],
  'Vote by': commonStyles['vote-by'],
  Threshold: commonStyles.amount
};

interface PoliciesProps {
  policies: VotePolicy[];
  groups: string[];
  tokens: string[];
}

export const Policies: React.FC<PoliciesProps> = ({
  policies,
  groups,
  tokens
}) => {
  const [selected, { push, removeAt }] = useList(policies);

  const addPolicy = useCallback(() => push({}), [push]);
  const removePolicy = useCallback((index: number) => () => removeAt(index), [
    removeAt
  ]);

  return (
    <>
      <div
        className={classNames(commonStyles.row, styles.header, styles.title)}
      >
        {Object.entries(headerValues).map(entry => {
          const [header, style] = entry;

          return (
            <div className={classNames(commonStyles.title, style)}>
              {header}
            </div>
          );
        })}
      </div>
      {selected.map((policy, index) => (
        <PolicyRow
          policy={policy}
          groups={groups}
          tokens={tokens}
          removePolicyHandler={removePolicy(index)}
        />
      ))}
      <Button className={styles.add} variant="tertiary" onClick={addPolicy}>
        <Icon name="buttonAdd" className={styles.icon} />
        <div className={styles.caption}>Add</div>
      </Button>
    </>
  );
};
