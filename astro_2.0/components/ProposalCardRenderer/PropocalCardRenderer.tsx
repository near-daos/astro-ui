import React from 'react';

import styles from './ProposalCardRenderer.module.scss';

export interface ProposalCardRendererProps {
  letterHeadNode?: React.ReactNode;
  proposalCardNode: React.ReactNode;
  daoFlagNode?: React.ReactNode;
  infoPanelNode?: React.ReactNode;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  letterHeadNode,
  daoFlagNode,
  proposalCardNode,
  infoPanelNode,
}) => {
  return (
    <div className={styles.root}>
      {letterHeadNode && (
        <div className={styles.letterHead}>{letterHeadNode}</div>
      )}
      {daoFlagNode && <div className={styles.daoFlag}>{daoFlagNode}</div>}
      <div className={styles.proposal}>{proposalCardNode}</div>
      {infoPanelNode && <div className={styles.infoPanel}>{infoPanelNode}</div>}
    </div>
  );
};
