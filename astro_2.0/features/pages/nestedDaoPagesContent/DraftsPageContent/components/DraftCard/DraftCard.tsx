import React, { FC } from 'react';
import {
  LetterHeadWidget,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';
import { DraftCardContent } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftCard/DraftCardContent';

import { DraftProposalFeedItem } from 'types/draftProposal';

import styles from './DraftCard.module.scss';

interface Props {
  data: DraftProposalFeedItem;
  flag: string;
  daoId: string;
}

export const DraftCard: FC<Props> = ({ data, flag, daoId }) => {
  return (
    <div className={styles.root}>
      <ProposalCardRenderer
        className={styles.card}
        showInfo={false}
        daoFlagNode={null}
        proposalCardNode={<DraftCardContent data={data} daoId={daoId} />}
        infoPanelNode={null}
        letterHeadNode={
          <LetterHeadWidget
            type={data.type}
            coverUrl={flag}
            className={styles.letterhead}
            iconClassName={styles.letterheadIcon}
            iconWrapperClassName={styles.letterheadIconWrapper}
          />
        }
      />
    </div>
  );
};
