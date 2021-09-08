import { ProposalCardProps } from 'components/cards/proposal-card';
import styles from 'features/search/search-results/components/dropdown-results/dropdown-results.module.scss';
import { Badge } from 'components/badge/Badge';
import React, { ReactNode } from 'react';

export function getProposalSearchSummary(
  proposal: ProposalCardProps
): ReactNode {
  let content;

  switch (proposal.type) {
    case 'Add member': {
      content = (
        <div className={styles.summary}>
          <span>
            Add <strong>{proposal.title}</strong> as a member to
          </span>
          <Badge size="small">Group name</Badge>
        </div>
      );
      break;
    }
    case 'Remove member': {
      content = (
        <div className={styles.summary}>
          <span>
            Remove <strong>{proposal.title}</strong> from
          </span>
          <Badge size="small">Group name</Badge>
        </div>
      );
      break;
    }
    case 'Create group': {
      content = (
        <div className={styles.summary}>
          <span>Create new group</span>
          <Badge size="small">Group name</Badge>
        </div>
      );
      break;
    }
    case 'Request payout': {
      content = (
        <div className={styles.summary}>
          <span>I would like to request a payment</span>
        </div>
      );
      break;
    }
    default: {
      content = '';
    }
  }

  return (
    <div className={styles.row} key={proposal.id}>
      {content}
      <div className={styles.secondaryLabel}>{proposal.type}</div>
    </div>
  );
}
