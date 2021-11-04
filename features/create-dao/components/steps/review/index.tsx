import React from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';

import {
  DAO_PROPOSALS_OPTIONS,
  DAO_STRUCTURE_OPTIONS,
  DAO_VOTING_POWER_OPTIONS,
} from 'features/create-dao/components/steps/data';

// import { CreateDaoInput } from 'types/dao';
// import { nearConfig } from 'config';

// import { SputnikWalletError } from 'errors/SputnikWalletError';

import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';
import { Button } from 'components/button/Button';
// import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAOFormValues } from 'features/create-dao/components/steps/types';
import { DaoDetails } from 'features/dao-home/components/dao-details/DaoDetails';
import { DaoOptionCard } from 'features/create-dao/components/option-card/DaoOptionCard';
// import { getRolesVotingPolicy } from 'features/create-dao/components/steps/review/helpers';

// import { SputnikNearService } from 'services/sputnik';
// import awsUploader from 'services/AwsUploader/AwsUploader';

import styles from 'features/create-dao/components/steps/form/form.module.scss';

export function ReviewView(): JSX.Element {
  const { getValues, handleSubmit } = useFormContext<DAOFormValues>();
  // const router = useRouter();

  const dao = getValues();

  const options = [
    DAO_PROPOSALS_OPTIONS[dao.proposals],
    DAO_STRUCTURE_OPTIONS[dao.structure],
    DAO_VOTING_POWER_OPTIONS[dao.voting],
  ];

  async function onSubmit(data: DAOFormValues) {
    // eslint-disable-next-line no-console
    console.log(
      'We should create DAO with following data, but now we use new approach:',
      data
    );

    // const { Key: fileName } = await awsUploader.uploadToBucket(data.flag);
    //
    // try {
    //   await SputnikNearService.createDao({
    //     name: data.address,
    //     purpose: data.purpose,
    //     links: data.websites as CreateDaoInput['links'],
    //     flag: fileName,
    //     bond: '0.1',
    //     votePeriod: '168',
    //     gracePeriod: '24',
    //     amountToTransfer: '5',
    //     displayName: data.displayName,
    //     policy: {
    //       ...getRolesVotingPolicy(data, SputnikNearService.getAccountId()),
    //       proposalBond: '0.1',
    //       proposalPeriod: '168',
    //       bountyBond: '0.1',
    //       bountyForgivenessPeriod: '168',
    //     },
    //   });
    //
    //   showNotification({
    //     type: NOTIFICATION_TYPES.INFO,
    //     description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
    //     lifetime: 20000,
    //   });
    //
    //   await router.push(`/dao/${data.address}.${nearConfig.contractName}`);
    // } catch (error) {
    //   console.warn(error);
    //
    //   if (error instanceof SputnikWalletError) {
    //     showNotification({
    //       type: NOTIFICATION_TYPES.ERROR,
    //       description: error.message,
    //       lifetime: 20000,
    //     });
    //   }
    // }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>Review and launch</h2>
      </div>
      <div className={styles.form}>
        <DaoDetails
          title={dao.displayName}
          flag={dao.flagPreview}
          subtitle={dao.address}
          createdAt="now"
          links={dao.websites}
          description={dao.purpose}
        />

        {options.map(option => (
          <DaoOptionCard
            key={option.value}
            iconNode={<Icon width={56} name={option.icon} />}
            title={option.title}
            subject={option.subject}
            description={option.description}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <div style={{ gap: '16px' }} className={styles.inline}>
          <Link href="/create-dao/flag" as="/create-dao/flag">
            <a href="*" className={styles.inline}>
              <Icon width={24} name="buttonArrowLeft" />
              <Title size={5}>Back</Title>
            </a>
          </Link>
          <Title className={styles.gray} size={5}>
            Step 5 of 5
          </Title>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          style={{ textTransform: 'none' }}
        >
          <span className={styles.gray}> Next:</span> Launch DAO
        </Button>
      </div>
    </div>
  );
}
