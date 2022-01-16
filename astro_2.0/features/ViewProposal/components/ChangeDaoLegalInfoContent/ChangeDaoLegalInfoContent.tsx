import cn from 'classnames';
import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

import styles from './ChangeDaoLegalInfoContent.module.scss';

interface ChangeDaoLegalInfoProps {
  daoId: string;
  legalLink?: string;
  legalStatus?: string;
}

export const ChangeDaoLegalInfoContent: VFC<ChangeDaoLegalInfoProps> = ({
  daoId,
  legalLink,
  legalStatus,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.dataHolder}>
        <FieldWrapper label={t('proposalCard.newDAOLegalStatus')}>
          <FieldValue value={legalStatus} />
        </FieldWrapper>

        <FieldWrapper label={t('proposalCard.newDAOLegalDoc')}>
          <FieldValue
            noWrap
            normal
            value={
              <a
                target="_blank"
                href={legalLink}
                rel="noopener noreferrer"
                className={styles.legalLink}
                onClick={e => e.stopPropagation()}
              >
                {legalLink}
              </a>
            }
          />
        </FieldWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget
          label={t('proposalCard.proposalTarget')}
          value={daoId}
          valueFontSize="S"
        />
      </div>
    </div>
  );
};
