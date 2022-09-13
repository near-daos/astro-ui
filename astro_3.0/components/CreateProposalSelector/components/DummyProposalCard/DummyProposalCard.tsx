import React, { FC } from 'react';
import { IconButton } from 'components/button/IconButton';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { useTranslation } from 'next-i18next';
import { useWalletContext } from 'context/WalletContext';
import { Icon } from 'components/Icon';

import styles from './DummyProposalCard.module.scss';

interface Props {
  onClose: () => void;
}

export const DummyProposalCard: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const { accountId } = useWalletContext();

  return (
    <div className={styles.root}>
      <div className={styles.proposalCell}>
        <InfoBlockWidget
          label={`${t('proposalCard.proposalType')}${t(
            'viewProposalCard.proposalVariant.transfer'
          )}`}
          value={t('viewProposalCard.proposalVariant.transfer')}
        />
      </div>
      <div className={styles.countdownCell}>
        {t('createProposal.countdown')}
      </div>
      <div className={styles.proposerCell}>
        <InfoBlockWidget
          label={t('proposalCard.proposalOwner')}
          value={accountId}
        />
      </div>
      <div className={styles.descriptionCell}>
        Please select a DAO to create proposal
      </div>
      <div className={styles.voteControlCell}>
        <Icon name="votingYesChecked" className={styles.voteIcon} />
        <Icon name="votingNoChecked" className={styles.voteIcon} />
      </div>
      <div className={styles.actionBar}>
        <IconButton icon="close" className={styles.action} onClick={onClose} />
      </div>
    </div>
  );
};
