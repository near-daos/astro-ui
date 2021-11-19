import React from 'react';
import cn from 'classnames';
import isNumber from 'lodash/isNumber';

import styles from './ProposalCardRenderer.module.scss';

export interface ProposalCardRendererProps {
  proposalId?: number;
  letterHeadNode?: React.ReactNode;
  proposalCardNode: React.ReactNode;
  daoFlagNode?: React.ReactNode;
  infoPanelNode?: React.ReactNode;
  className?: string;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  letterHeadNode,
  daoFlagNode,
  proposalCardNode,
  infoPanelNode,
  className,
  proposalId,
}) => {
  function renderFlag() {
    return daoFlagNode ? (
      <div className={styles.daoFlag}>{daoFlagNode}</div>
    ) : null;
  }

  function renderProposalId() {
    if (isNumber(proposalId)) {
      return (
        <div className={styles.proposalIdCell}>
          <span className={styles.proposalIdLabel}>Proposal ID:&nbsp;</span>
          <span className={styles.proposalIdValue}>{proposalId}</span>
        </div>
      );
    }

    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.header}>
        <div>{renderFlag()}</div>
        {renderProposalId()}
      </div>
      {letterHeadNode && (
        <div className={styles.letterHead}>{letterHeadNode}</div>
      )}
      <div className={styles.proposal}>{proposalCardNode}</div>
      {infoPanelNode && <div className={styles.infoPanel}>{infoPanelNode}</div>}
    </div>
  );
};
