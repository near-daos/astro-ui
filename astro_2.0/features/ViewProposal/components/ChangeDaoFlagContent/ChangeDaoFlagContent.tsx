import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { useModal } from 'components/modal';
import { PreviewModal } from 'astro_2.0/features/CreateDao/components/PreviewModal';
import { Button } from 'components/button/Button';

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
  const [showModal] = useModal(PreviewModal);

  const handleAssetsPreview = useCallback(async () => {
    await showModal({
      cover: cover || '/flags/defaultDaoFlag.png',
      logo,
    });
  }, [cover, logo, showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label={t('proposalCard.preview')} fullWidth>
          {logo && (
            <div className={styles.flag}>
              <DaoLogo src={logo} />
            </div>
          )}
        </FieldWrapper>
      </div>
      <div className={styles.preview}>
        <Button
          variant="secondary"
          size="small"
          onClick={handleAssetsPreview}
          className={styles.previewButton}
        >
          Preview Flag & Letterhead
        </Button>
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
