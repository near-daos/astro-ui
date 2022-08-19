import styles from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults/DropdownResults.module.scss';
import { Badge } from 'components/Badge';
import React, { ReactNode } from 'react';
import { Proposal, ProposalType } from 'types/proposal';
import { Button } from 'components/button/Button';
import TextTruncate from 'react-text-truncate';

export function getProposalSearchSummary(
  proposal: Proposal,
  onClick: () => void
): ReactNode {
  let content;

  switch (proposal.kind.type) {
    case ProposalType.AddMemberToRole: {
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
    case ProposalType.RemoveMemberFromRole: {
      content = (
        <div className={styles.summary}>
          <span>
            Remove <strong>{proposal.kind.memberId}</strong> from
          </span>
          <Badge size="small">{proposal.kind.role}</Badge>
        </div>
      );
      break;
    }
    case ProposalType.ChangePolicy: {
      content = (
        <div className={styles.summary}>
          <span>
            This is a proposal to change voting policies for our groups.
          </span>
        </div>
      );
      break;
    }
    case ProposalType.FunctionCall: {
      content = (
        <div className={styles.summary}>
          <span>Function call</span>
        </div>
      );
      break;
    }
    case ProposalType.Transfer: {
      content = (
        <div className={styles.summary}>
          <span>I would like to request a payment</span>
        </div>
      );
      break;
    }
    case ProposalType.Vote:
    case ProposalType.AddBounty:
    case ProposalType.BountyDone:
    case ProposalType.UpgradeSelf:
    case ProposalType.UpgradeRemote:
    case ProposalType.SetStakingContract:
    default: {
      content = (
        <div className={styles.summary}>
          <TextTruncate
            line={3}
            element="span"
            truncateText="…"
            text={proposal.description}
            textTruncateChild={null}
          />
        </div>
      );
    }
  }

  return (
    <Button
      variant="tertiary"
      onClick={onClick}
      className={styles.row}
      key={proposal.id}
    >
      {content}
    </Button>
  );
}
