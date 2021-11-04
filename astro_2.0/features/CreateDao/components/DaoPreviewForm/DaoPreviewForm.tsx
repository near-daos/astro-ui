import React, { VFC } from 'react';
import { useFormContext } from 'react-hook-form';

import { nearConfig } from 'config';

import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';
import { DaoDetailsPreview } from 'astro_2.0/components/DaoDetails/DaoDetailsPreview';
import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator/UnitSeparator';

import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';

import styles from './DaoPreviewForm.module.scss';

export const DaoPreviewForm: VFC = () => {
  const { getValues } = useFormContext<DAOFormValues>();

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
    flagCover: getImageFromImageFileList(flagCover),
    flagLogo: getImageFromImageFileList(flagLogo),
  };

  return (
    <div className={styles.root}>
      <UnitSeparator />
      <div className={styles.header}>
        <h2>Preview of&nbsp;your future DAO</h2>
        <p>
          Make sure everything right and clear, this is&nbsp;how users will see
          your DAO on&nbsp;the platform!
        </p>
      </div>
      <div className={styles.content}>
        <DaoDetailsPreview dao={daoData} />
      </div>
    </div>
  );
};
