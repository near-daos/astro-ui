import get from 'lodash/get';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { nearConfig } from 'config';

import { SputnikWalletError } from 'errors/SputnikWalletError';

import { CreateDaoInput } from 'types/dao';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';

import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator/UnitSeparator';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget/TransactionDetailsWidget';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { getRolesVotingPolicy } from 'features/create-dao/components/steps/review/helpers';

import { SputnikNearService } from 'services/sputnik';
import awsUploader from 'services/AwsUploader/AwsUploader';

import styles from './DaoSubmitForm.module.scss';

export function DaoSubmitForm(): JSX.Element {
  const router = useRouter();
  const { setError } = useFormContext();

  const uploadImg = useCallback(async (img: File) => {
    if (img) {
      const { Key } = await awsUploader.uploadToBucket(img);

      return Key;
    }

    return '';
  }, []);

  const createDao = useCallback(
    async (data: DAOFormValues) => {
      const daoAddressExists = await SputnikNearService.nearAccountExist(
        `${data.address}.${nearConfig.contractName}`
      );

      if (daoAddressExists) {
        setError('address', {
          message: 'Dao with such address already exists.',
        });

        return;
      }

      const flagCover = get(data.flagCover, '0');
      const flagLogo = get(data.flagLogo, '0');

      const [flagCoverFileName, flagLogoFileName] = await Promise.all([
        uploadImg(flagCover),
        uploadImg(flagLogo),
      ]);

      try {
        await SputnikNearService.createDao({
          name: data.address,
          purpose: data.purpose,
          links: data.websites as CreateDaoInput['links'],
          flagCover: flagCoverFileName,
          flagLogo: flagLogoFileName,
          bond: '0.1',
          votePeriod: '168',
          gracePeriod: '24',
          amountToTransfer: '5',
          displayName: data.displayName,
          policy: {
            ...getRolesVotingPolicy(data, SputnikNearService.getAccountId()),
            proposalBond: '0.1',
            proposalPeriod: '168',
            bountyBond: '0.1',
            bountyForgivenessPeriod: '168',
          },
        });

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000,
        });

        await router.push(`/dao/${data.address}.${nearConfig.contractName}`);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [router, setError, uploadImg]
  );

  return (
    <div className={styles.root}>
      <UnitSeparator />
      <div className={styles.content}>
        <TransactionDetailsWidget
          onSubmit={createDao}
          standAloneMode
          bond="5"
          gas="0.3"
          transaction="Create New DAO"
          buttonLabel="Create DAO"
        />
      </div>
    </div>
  );
}
