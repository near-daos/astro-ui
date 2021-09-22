import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';
import { DaoOptionCard } from 'features/create-dao/components/option-card/DaoOptionCard';
import {
  DAO_PROPOSALS_OPTIONS,
  DAO_STRUCTURE_OPTIONS,
  DAO_VOTING_POWER_OPTIONS
} from 'features/create-dao/components/steps/data';
import styles from 'features/create-dao/components/steps/form/form.module.scss';
import { DAOFormValues } from 'features/create-dao/components/steps/types';
import { DaoDetails } from 'features/dao-home/components/dao-details/DaoDetails';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useFormContext } from 'react-hook-form';
import awsUploader from 'services/AwsUploader/AwsUploader';
import { SputnikService } from 'services/SputnikService';
import { getRolesVotingPolicy } from 'features/create-dao/components/steps/review/helpers';

export function ReviewView(): JSX.Element {
  const { getValues, handleSubmit } = useFormContext<DAOFormValues>();
  const router = useRouter();

  const dao = getValues();

  const options = [
    DAO_PROPOSALS_OPTIONS[dao.proposals],
    DAO_STRUCTURE_OPTIONS[dao.structure],
    DAO_VOTING_POWER_OPTIONS[dao.voting]
  ];

  async function onSubmit(data: DAOFormValues) {
    await awsUploader.uploadToBucket(data.flag);

    await SputnikService.createDao({
      name: data.address,
      purpose: data.purpose,
      council: 'council',
      bond: '0.1',
      votePeriod: '168',
      gracePeriod: '24',
      amountToTransfer: '5',
      policy: {
        ...getRolesVotingPolicy(data),
        proposalBond: '0.1',
        proposalPeriod: '168',
        bountyBond: '0.1',
        bountyForgivenessPeriod: '168'
      }
    });

    await router.push('/home');
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
