import React, { FC, useState } from 'react';

import { Modal } from 'components/modal';
import { CompareProposal } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareProposal';
import { IconButton } from 'components/button/IconButton';

import { ProposalFeedItem } from 'types/proposal';
import { Token } from 'types/token';

import styles from './CompareVersionsModal.module.scss';

export interface Props {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
  index: number;
  tokens: Record<string, Token>;
  data: ProposalFeedItem[];
}

export const CompareVersionsModal: FC<Props> = ({
  isOpen,
  onClose,
  tokens,
  data,
  index,
}) => {
  const [selection, setSelection] = useState({
    prevVersionInd: index,
    currentVersionInd: index + 1,
  });
  const prevVersion = data[selection.prevVersionInd];
  const currentVersion = data[selection.currentVersionInd];

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
        <div className={styles.footer}>
          <IconButton
            icon="buttonArrowLeft"
            className={styles.arrow}
            disabled={selection.prevVersionInd === 0}
            onClick={() =>
              setSelection(prev => ({
                prevVersionInd: prev.prevVersionInd - 1,
                currentVersionInd: prev.currentVersionInd - 1,
              }))
            }
          />
          <span>{selection.prevVersionInd + 1}</span>
          <span>&nbsp;-&nbsp;</span>
          <span>{selection.currentVersionInd + 1}</span>
          <span className={styles.secondary}>/</span>
          <span className={styles.secondary}>{data.length}</span>
          <IconButton
            icon="buttonArrowRight"
            className={styles.arrow}
            disabled={selection.currentVersionInd === data.length - 1}
            onClick={() =>
              setSelection(prev => ({
                prevVersionInd: prev.prevVersionInd + 1,
                currentVersionInd: prev.currentVersionInd + 1,
              }))
            }
          />
        </div>
      </div>
    </Modal>
  );
};
