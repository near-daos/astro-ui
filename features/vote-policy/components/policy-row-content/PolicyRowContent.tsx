import React, { FC, useCallback } from 'react';

import { IconButton } from 'components/button/IconButton';
import { VotePolicy } from 'features/vote-policy/components/policy-row';
import { Badge } from 'components/badge/Badge';
import { useModal } from 'components/modal';
import { VotePolicyPopup } from 'features/vote-policy/VotePolicyPopup';
import { PolicyProps } from 'features/vote-policy/helpers';
import { TGroup } from 'types/dao';

import styles from './policy-row-content.module.scss';

interface PolicyRowContentProps {
  proposers: string[];
  policies: VotePolicy[];
  viewMode: boolean;
  action:
    | 'Create bounty'
    | 'Close bounty'
    | 'Create poll'
    | 'NEAR function'
    | 'Add member to group'
    | 'Remove member from group'
    | 'Request payout'
    | 'Upgrade self'
    | 'Upgrade remote'
    | 'Config'
    | 'Policy';
  onChange: (value: PolicyProps) => void;
  data: PolicyProps;
  groups: TGroup[];
}

export const PolicyRowContent: FC<PolicyRowContentProps> = ({
  proposers,
  viewMode,
  action,
  onChange,
  data,
  groups
}) => {
  const [showModal] = useModal(VotePolicyPopup, {
    title: action,
    groups
  });

  const handleEdit = useCallback(async () => {
    const result = await showModal({ data, proposers });

    if (result?.length) {
      onChange(result[0] as PolicyProps);
    }
  }, [data, onChange, proposers, showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.propose}>
        <div className={styles.label}>Who can propose</div>
        {data.whoCanPropose.map(item => (
          <Badge size="small" key={item}>
            {item}
          </Badge>
        ))}
      </div>
      <div className={styles.vote}>
        <div className={styles.label}>Who can vote</div>
        {data.policies.map(item => (
          <div
            key={`${item.whoCanVote}_${item.amount}_${item.threshold}`}
            className={styles.row}
          >
            <Badge size="small">{item.whoCanVote}</Badge>
            <div>{item.amount}</div>
            <div>{item.threshold}</div>
            <div>to pass</div>
          </div>
        ))}
      </div>
      {!viewMode && (
        <div className={styles.edit}>
          <IconButton
            icon="buttonEdit"
            size="medium"
            className={styles.edit}
            onClick={handleEdit}
          />
        </div>
      )}
    </div>
  );
};
