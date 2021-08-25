import React, { FC, useCallback } from 'react';

import { IconButton } from 'components/button/IconButton';
import { VotePolicy } from 'features/vote-policy/components/policy-row';
import { Badge } from 'components/badge/Badge';
import { useModal } from 'components/modal';
import { VotePolicyPopup } from 'features/vote-policy/VotePolicyPopup';

import styles from './accordeon-content.module.scss';

interface AccordeonContentProps {
  proposers: string[];
  policies: VotePolicy[];
  viewMode: boolean;
  action: 'Create bounty' | 'Close bounty' | 'Create poll' | 'NEAR function';
}

export const AccordeonContent: FC<AccordeonContentProps> = ({
  proposers,
  policies,
  viewMode,
  action
}) => {
  const [showModal] = useModal(VotePolicyPopup, {
    policies,
    proposers,
    title: action
  });

  const handleEdit = useCallback(async () => {
    await showModal();
  }, [showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.propose}>
        <div className={styles.label}>Who can propose</div>
        {proposers.map(item => (
          <Badge key={item} size="small">
            {item}
          </Badge>
        ))}
      </div>
      <div className={styles.vote}>
        <div className={styles.label}>Who can vote</div>
        {policies.map(item => (
          <div
            key={`${item.whoCanVote}_${item.amount}_${item.threshold}`}
            className={styles.row}
          >
            <Badge size="small">{item.whoCanVote}</Badge>
            <div>{item.amount}</div>
            <div>{item.threshold}</div>
            <div>{item.voteBy}</div>
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
