import styles from 'features/search/search-results/components/dropdown-results/dropdown-results.module.scss';
import { Badge } from 'components/badge/Badge';
import React, { ReactNode } from 'react';
import { Proposal } from 'types/proposal';

export function getProposalSearchSummary(proposal: Proposal): ReactNode {
  let content;

  switch (proposal.kind.type) {
    case 'AddMemberToRole': {
      content = (
        <div className={styles.summary}>
          <span>
            Add <strong>{proposal.kind.memberId}</strong> as a member to
          </span>
          <Badge size="small">{proposal.kind.role}</Badge>
        </div>
      );
      break;
    }
    case 'ChangePolicy': {
      content = (
        <div className={styles.summary}>
          <span>
            This is a proposal to change voting policies for our groups.
          </span>
        </div>
      );
      break;
    }
    case 'FunctionCall': {
      content = (
        <div className={styles.summary}>
          <span>Function call</span>
        </div>
      );
      break;
    }
    case 'Transfer': {
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
    </div>
  );
}
