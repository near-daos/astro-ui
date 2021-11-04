import React from 'react';
import { nearConfig } from 'config';
import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator/UnitSeparator';
import { DaoDetailsPreview } from 'astro_2.0/components/DaoDetails/DaoDetailsPreview';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';
import { useFormContext } from 'react-hook-form';
import styles from './DaoPreviewForm.module.scss';

export function DaoPreviewForm(): JSX.Element {
  // todo: check form state validation before submission
  const { getValues } = useFormContext<DAOFormValues>();
  const {
    address,
    displayName,
    purpose,
    websites,
    proposals,
    voting,
    structure,
  } = getValues();
  const isFormValid =
    !!address && !!displayName && !!proposals && !!voting && !!structure;
  const id = `${address}.${nearConfig.contractName}`;
  const daoData = isFormValid
    ? {
        id,
        name: address,
        displayName,
        description: purpose,
        links: websites,
        // todo: what funds should be shown on DAO preview?
        funds: '62.45',
        // todo: add real background and logo
        logo:
          'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg',
      }
    : {
        id: '',
        name: '',
        description: '',
        displayName: '',
        links: [],
        funds: '',
        logo: '',
      };

  return (
    <>
      {isFormValid && (
        <div className={styles.root}>
          <UnitSeparator />
          <div className={styles.header}>
            <h2>Preview of&nbsp;your future DAO</h2>
            <p>
              Make sure everything right and clear, this is&nbsp;how users will
              see your DAO on&nbsp;the platform!
            </p>
          </div>
          <div className={styles.content}>
            <DaoDetailsPreview dao={daoData} />
          </div>
        </div>
      )}
    </>
  );
}
