import { useFormContext } from 'react-hook-form';
import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';
import { FlagPreview } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreview';
import React from 'react';

export const FlagPreviewRenderer: React.FC = () => {
  const { watch, getValues } = useFormContext();

  const coverFileList = watch('flagCover');
  const logoFileList = watch('flagLogo');

  const { defaultFlag } = getValues();

  const coverImg = getImageFromImageFileList(coverFileList);
  const logoImg = getImageFromImageFileList(logoFileList);

  return <FlagPreview coverFile={coverImg || defaultFlag} logoFile={logoImg} />;
};
