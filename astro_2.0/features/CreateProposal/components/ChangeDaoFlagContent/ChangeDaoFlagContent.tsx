import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';
import { FlagRenderer } from 'astro_2.0/components/Flag';

import styles from './ChangeDaoFlagContent.module.scss';

interface ChangeDaoFlagContentProps {
  daoId: string;
}

export const ChangeDaoFlagContent: FC<ChangeDaoFlagContentProps> = ({
  daoId,
}) => {
  const { watch } = useFormContext();

  const coverFileList = watch('flagCover');
  const logoFileList = watch('flagLogo');

  const coverImg = getImageFromImageFileList(coverFileList);
  const logoImg = getImageFromImageFileList(logoFileList);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="flagCover" label="New Cover" fullWidth>
          <div className={styles.coverPlaceholder}>
            <ImageUpload fieldName="flagCover" />
          </div>
        </InputWrapper>

        <InputWrapper fieldName="flagLogo" label="New Logo" fullWidth>
          <div className={styles.logoPlaceholder}>
            <ImageUpload fieldName="flagLogo" />
          </div>
        </InputWrapper>

        <InputWrapper
          fieldName=""
          label={coverFileList ? 'Preview' : ''}
          fullWidth
        >
          <div className={styles.flag}>
            <FlagRenderer flag={coverImg} size="lg" logo={logoImg} />
          </div>
        </InputWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
