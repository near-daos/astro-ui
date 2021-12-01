import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { nearConfig } from 'config';

import { SputnikWalletError } from 'errors/SputnikWalletError';

import { CreateDaoInput } from 'types/dao';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';

import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator/UnitSeparator';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget/TransactionDetailsWidget';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { SputnikNearService } from 'services/sputnik';
import awsUploader from 'services/AwsUploader/AwsUploader';

import { getRolesVotingPolicy } from './helpers';

import styles from './DaoSubmitForm.module.scss';

export function DaoSubmitForm(): JSX.Element {
  const router = useRouter();
  const {
    formState: { errors },
  } = useFormContext();

  const uploadImg = useCallback(async (img: File) => {
    if (img) {
      const { Key } = await awsUploader.uploadToBucket(img);

      return Key;
    }

    return '';
  }, []);

  const createDao = useCallback(
    async (data: DAOFormValues) => {
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
    [router, uploadImg]
  );

  function renderErrorMessage() {
    return isEmpty(errors) ? null : (
      <div className={styles.error}>
        There are errors in your form. Please, check validation messages on the
        page.
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <UnitSeparator />
      <div className={styles.terms}>
        <span>Creating a DAO is a liability </span>
        <Link passHref href="/terms-conditions">
          <a href="*" className={styles.link} target="_blank">
            Terms and Conditions
          </a>
        </Link>
      </div>
      <div className={styles.content}>
        <TransactionDetailsWidget
          onSubmit={createDao}
          standAloneMode
          bond={{ label: 'Cost', value: '5000000000000000000000000' }}
          gas={{ value: '0.3' }}
          warning="DAOs can not be deleted!"
          buttonLabel="Create DAO"
        />
      </div>
      {renderErrorMessage()}
    </div>
  );
}
