import React from 'react';
import cn from 'classnames';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { InfoPanel } from 'astro_2.0/components/ProposalCardRenderer/components/InfoPanel';
import { Button } from 'components/button/Button';

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
  isEditDraft?: boolean;
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
  isEditDraft,
}) => {
  const { t } = useTranslation();
  const draftMethods = useFormContext();

  function renderFlag() {
    return daoFlagNode ? (
      <div className={styles.daoFlag}>{daoFlagNode}</div>
    ) : null;
  }

  function renderProposalId() {
    if (isDraft) {
      return null;
    }

    if (isNumber(proposalId)) {
      return (
        <div className={styles.proposalIdCell}>
          <span className={styles.proposalIdLabel}>
            {t('proposalCard.proposalID')}
          </span>
          <span className={styles.proposalIdValue}>{proposalId}</span>
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

  const onSaveDraft = () => undefined;

  return (
    <div className={cn(styles.root, className)}>
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
      {isEditDraft ? (
        <Button
          disabled={Object.keys(draftMethods?.formState?.errors).length > 0}
          capitalize
          type="submit"
          className={styles.saveDraftButton}
          onClick={draftMethods?.handleSubmit(onSaveDraft)}
        >
          Save
        </Button>
      ) : null}
    </div>
  );
};
