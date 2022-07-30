import React from 'react';
import cn from 'classnames';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'next-i18next';

import { InfoPanel } from 'astro_2.0/components/ProposalCardRenderer/components/InfoPanel';
import { ProposalFeedItem } from 'types/proposal';
import { DraftProposal } from 'types/draftProposal';

import styles from './ProposalCardRenderer.module.scss';

export interface ProposalCardRendererProps {
  proposalId?: number | null;
  letterHeadNode?: React.ReactNode;
  proposalCardNode: React.ReactNode;
  daoFlagNode?: React.ReactNode;
  infoPanelNode?: React.ReactNode;
  className?: string;
  showInfo?: boolean;
  optionalActionNode?: React.ReactNode;
  isDraft?: boolean;
  nonActionable?: boolean;
  proposal?: ProposalFeedItem | DraftProposal;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  letterHeadNode,
  daoFlagNode,
  proposalCardNode,
  infoPanelNode,
  className,
  proposalId,
  showInfo,
  optionalActionNode,
  isDraft,
  nonActionable,
  proposal,
}) => {
  const { t } = useTranslation();

  function renderFlag() {
    return daoFlagNode ? (
      <div className={styles.daoFlag}>{daoFlagNode}</div>
    ) : null;
  }

  function renderProposalId() {
    if (isDraft) {
      return null;
    }

    if (isNumber(proposal?.proposalId)) {
      return (
        <div className={styles.proposalIdCell} data-testid="proposal-id">
          <span className={styles.proposalIdLabel}>
            {t('proposalCard.proposalID')}
          </span>
          <span className={styles.proposalIdValue}>{proposal?.proposalId}</span>
        </div>
      );
    }

    return null;
  }

  function renderInfoPanel() {
    if (proposalId === undefined && showInfo) {
      return <InfoPanel />;
    }

    return null;
  }

  return (
    <div
      className={cn(
        styles.root,
        {
          [styles.nonActionable]: nonActionable,
        },
        className
      )}
    >
      <div className={styles.header}>
        <div className={styles.flagWrapper}>{renderFlag()}</div>
        {renderInfoPanel()}
        {renderProposalId()}
        {optionalActionNode}
      </div>
      {letterHeadNode && (
        <div className={styles.letterHead}>{letterHeadNode}</div>
      )}
      <div className={styles.proposal}>{proposalCardNode}</div>
      {infoPanelNode && <div className={styles.infoPanel}>{infoPanelNode}</div>}
    </div>
  );
};
