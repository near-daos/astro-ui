import React, { FC, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';
import { useModal } from 'components/modal';
import { PreviewModal } from 'astro_2.0/features/CreateDao/components/PreviewModal';

import { Button } from 'components/button/Button';

import styles from './ChangeDaoFlagContent.module.scss';

interface ChangeDaoFlagContentProps {
  daoId: string;
}

export const ChangeDaoFlagContent: FC<ChangeDaoFlagContentProps> = ({
  daoId,
}) => {
  const [showModal] = useModal(PreviewModal);
  const { watch } = useFormContext();
  const { t } = useTranslation();

  const coverFileList = watch('flagCover');
  const logoFileList = watch('flagLogo');

  const coverImg = useMemo(
    () => getImageFromImageFileList(coverFileList),
    [coverFileList]
  );
  const logoImg = useMemo(
    () => getImageFromImageFileList(logoFileList),
    [logoFileList]
  );

  const handleAssetsPreview = useCallback(async () => {
    await showModal({
      cover: coverImg || '/flags/defaultDaoFlag.png',
      logo: logoImg,
    });
  }, [coverImg, logoImg, showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper
          fieldName="flagCover"
          label={t('proposalCard.newDAOCover')}
          fullWidth
        >
          <div className={styles.coverPlaceholder}>
            <ImageUpload fieldName="flagCover" />
          </div>
        </InputWrapper>

        <InputWrapper
          fieldName="flagLogo"
          label={t('proposalCard.newDAOLogo')}
          fullWidth
        >
          <div className={styles.logoPlaceholder}>
            <ImageUpload fieldName="flagLogo" />
          </div>
        </InputWrapper>
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
