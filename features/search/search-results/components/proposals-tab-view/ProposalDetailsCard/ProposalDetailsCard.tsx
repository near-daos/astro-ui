import React, { FC } from 'react';
import {
  LetterHeadWidget,
  ProposalCardRenderer,
} from 'astro_2.0/components/ProposalCardRenderer';

import { ProposalDetailsCardContent } from 'features/search/search-results/components/proposals-tab-view/ProposalDetailsCard/ProposalDetailsCardContent';
import { ProposalDetails } from 'types/proposal';

import styles from './ProposalDetailsCard.module.scss';

interface Props {
  data: ProposalDetails;
}

export const ProposalDetailsCard: FC<Props> = ({ data }) => {
  return (
    <div className={styles.root}>
      <ProposalCardRenderer
        className={styles.card}
        showInfo={false}
        daoFlagNode={null}
        proposalCardNode={<ProposalDetailsCardContent data={data} />}
        infoPanelNode={null}
        letterHeadNode={
          <LetterHeadWidget
            type={data.kind.type}
            coverUrl={data.flag}
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
