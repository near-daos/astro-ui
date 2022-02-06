import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { nearConfig } from 'config';

import { SputnikWalletError } from 'errors/SputnikWalletError';

import { CreateDaoInput } from 'types/dao';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';

import { UnitSeparator } from 'astro_2.0/features/CreateDao/components/UnitSeparator/UnitSeparator';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget/TransactionDetailsWidget';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { SputnikNearService } from 'services/sputnik';
import { AwsUploader } from 'services/AwsUploader';

import { getRolesVotingPolicy } from './helpers';

import styles from './DaoSubmitForm.module.scss';

export function DaoSubmitForm(): JSX.Element {
  const router = useRouter();

  const { t } = useTranslation();

  const {
    formState: { errors },
  } = useFormContext();

  const uploadImg = useCallback(async (img: File) => {
    if (img) {
      const key = await AwsUploader.uploadToBucket(img);

      return key;
    }

    return '';
  }, []);

  async function loadImage(defaultFlag: string) {
    const response = await fetch(defaultFlag);
    const blob = await response.blob();

    return new File([blob], 'image.png', { type: 'image/png' });
  }

  const createDao = useCallback(
    async (data: DAOFormValues) => {
      try {
        const defaultFlagFile = await loadImage(data.defaultFlag);

        const flagCover = get(data.flagCover, '0') || defaultFlagFile;
        const flagLogo = get(data.flagLogo, '0');

        const [flagCoverFileName, flagLogoFileName] = await Promise.all([
          uploadImg(flagCover),
          uploadImg(flagLogo),
        ]);

        const {
          address,
          purpose,
          websites,
          displayName,
          legalStatus,
          legalLink,
          gas,
        } = data;

        await SputnikNearService.createDao({
          name: address,
          purpose,
          links: websites as CreateDaoInput['links'],
          flagCover: flagCoverFileName,
          flagLogo: flagLogoFileName,
          bond: '0.1',
          votePeriod: '168',
          gracePeriod: '24',
          amountToTransfer: '5',
          displayName,
          policy: {
            ...getRolesVotingPolicy(data, SputnikNearService.getAccountId()),
            proposalBond: '0.1',
            proposalPeriod: '168',
            bountyBond: '0.1',
            bountyForgivenessPeriod: '168',
          },
          legal: {
            legalStatus,
            legalLink,
          },
          gas,
        });

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: t('notifications.transactionDelay'),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, uploadImg]
  );

  function renderErrorMessage() {
    return isEmpty(errors) ? null : (
      <div className={styles.error}>
        {t('createDAO.daoSubmitForm.daoSubmitError')}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <UnitSeparator />
      <div className={styles.terms}>
        <span>{t('createDAO.daoSubmitForm.daoSubmitLiability')}</span>
        <Link passHref href="/terms-conditions">
          <a href="*" className={styles.link} target="_blank">
            {t('createDAO.daoSubmitForm.daoTermsAndConditionsLink')}
          </a>
        </Link>
      </div>
      <div className={styles.content}>
        <TransactionDetailsWidget
          onSubmit={createDao}
          standAloneMode
          bond={{ label: 'Cost', value: '5000000000000000000000000' }}
          warning={t('createDAO.daoSubmitForm.daoCannotBeDeleted')}
          buttonLabel={t('createDAO.daoSubmitForm.daoCreateButton')}
        />
      </div>
      {renderErrorMessage()}
    </div>
  );
}
