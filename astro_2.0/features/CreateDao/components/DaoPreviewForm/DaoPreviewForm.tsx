import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { nearConfig } from 'config';

import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';

import { DaoDetailsPreview } from 'astro_2.0/components/DaoDetails';
import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './DaoPreviewForm.module.scss';

export const DaoPreviewForm: VFC = () => {
  const { watch, getValues } = useFormContext<DAOFormValues>();
  const { t } = useTranslation();

  // Need to watch values otherwise value can get stuck
  const legalLink = watch('legalLink');
  const legalStatus = watch('legalStatus');

  const {
    address,
    displayName,
    purpose,
    websites,
    proposals,
    voting,
    structure,
    flagCover,
    flagLogo,
    defaultFlag,
  } = getValues();

  const daoDataReady =
    !!address && !!displayName && !!proposals && !!voting && !!structure;

  if (!daoDataReady) {
    return null;
  }

  const id = `${address}.${nearConfig.contractName}`;
  const daoData = {
    id,
    name: address,
    displayName,
    description: purpose,
    links: websites,
    // todo: what funds should be shown on DAO preview?
    funds: '62.45',
    flagCover: getImageFromImageFileList(flagCover) || defaultFlag,
    flagLogo: getImageFromImageFileList(flagLogo),
    legal: {
      legalLink,
      legalStatus,
    },
  };

  return (
    <div className={styles.root}>
      <UnitSeparator />
      <div className={styles.header}>
        <h2>{t('createDAO.daoPreviewFutureForm.daoPreviewFuture')}</h2>
        <p>{t('createDAO.daoPreviewFutureForm.daoMakeSureDescription')}</p>
      </div>
      <div className={styles.content}>
        <DaoDetailsPreview dao={daoData} />
      </div>
    </div>
  );
};
