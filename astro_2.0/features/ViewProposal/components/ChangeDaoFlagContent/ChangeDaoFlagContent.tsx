import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { FlagRenderer } from 'astro_2.0/components/Flag';

import styles from './ChangeDaoFlagContent.module.scss';

interface ChangeDaoFlagContentProps {
  daoId: string;
  cover?: string;
  logo?: string;
}

export const ChangeDaoFlagContent: FC<ChangeDaoFlagContentProps> = ({
  daoId,
  cover,
  logo,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.preview')} fullWidth>
          {cover && (
            <div className={styles.flag}>
              <FlagRenderer flag={cover} size="lg" logo={logo} />
            </div>
          )}
        </FieldWrapper>
      </div>
      <svg className="svg" width="0" height="0">
        <clipPath id="__DAO__flag-preview">
          <path d="M240.01 0L50.4101 67.7595V105.35L0 123.366V272L189.599 204.24V166.65L240.01 148.634V0Z" />
        </clipPath>
      </svg>
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
