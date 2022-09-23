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
  onSelect?: (id: string) => void;
  selectedList?: string[];
  disableEdit: boolean;
}

export const DraftCard: FC<Props> = ({
  data,
  flag,
  daoId,
  onSelect,
  selectedList,
  disableEdit,
}) => {
  return (
    <div className={styles.root}>
      <ProposalCardRenderer
        nonActionable={selectedList && selectedList?.length > 0 && disableEdit}
        className={styles.card}
        showInfo={false}
        daoFlagNode={null}
        proposalCardNode={
          <DraftCardContent
            data={data}
            daoId={daoId}
            onSelect={onSelect}
            selectedList={selectedList}
            disableEdit={disableEdit}
          />
        }
        infoPanelNode={null}
        letterHeadNode={
          <LetterHeadWidget
            type={data.type}
            coverUrl={flag}
            className={styles.letterhead}
            iconClassName={styles.letterheadIcon}
            iconWrapperClassName={styles.letterheadIconWrapper}
            backgroundClassName={styles.letterBackground}
          />
        }
      />
    </div>
  );
};
