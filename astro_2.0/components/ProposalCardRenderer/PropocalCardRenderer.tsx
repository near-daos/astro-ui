import React from 'react';

import styles from 'astro_2.0/components/ProposalCardRenderer/ProposalCardRenderer.module.scss';

export interface ProposalCardRendererProps {
  letterHeadNode: React.ReactNode;
  proposalCardNode: React.ReactNode;
  daoFlagNode: React.ReactNode;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  letterHeadNode,
  daoFlagNode,
  proposalCardNode,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.letterHead}>{letterHeadNode}</div>
      <div className={styles.daoFlag}>{daoFlagNode}</div>
      <div className={styles.proposal}>{proposalCardNode}</div>
    </div>
  );
};
