import React, { FC } from 'react';

import { Modal } from 'components/modal';
import { CompareProposal } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareProposal';

import { ProposalFeedItem } from 'types/proposal';
import { Token } from 'types/token';

import styles from './CompareVersionsModal.module.scss';

export interface Props {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
  currentVersion: ProposalFeedItem;
  prevVersion: ProposalFeedItem;
  tokens: Record<string, Token>;
}

export const CompareVersionsModal: FC<Props> = ({
  isOpen,
  onClose,
  prevVersion,
  currentVersion,
  tokens,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xxxl">
      <div className={styles.root}>
        <div className={styles.title}>Draft history</div>
        <div className={styles.body}>
          <div className={styles.column}>
            <CompareProposal
              current={prevVersion}
              compareWith={currentVersion}
              tokens={tokens}
              view="prev"
            />
          </div>
          <div className={styles.column}>
            <CompareProposal
              current={currentVersion}
              compareWith={prevVersion}
              tokens={tokens}
              view="current"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
