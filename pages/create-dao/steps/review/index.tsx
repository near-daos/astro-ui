import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';
import { DaoOptionCard } from 'features/create-dao/components/option-card/DaoOptionCard';
import { DaoDetails } from 'features/dao-home/components/dao-details/DaoDetails';
import Link from 'next/link';
import {
  DAO_PROPOSALS_OPTIONS,
  DAO_STRUCTURE_OPTIONS,
  DAO_VOTING_POWER_OPTIONS
} from 'pages/create-dao/steps/data';
import styles from 'pages/create-dao/steps/form/form.module.scss';
import { DAOFormValues } from 'pages/create-dao/steps/types';
import React from 'react';

import { useFormContext } from 'react-hook-form';

export function ReviewView(): JSX.Element {
  const { getValues } = useFormContext<DAOFormValues>();

  const dao = getValues();

  const options = [
    DAO_PROPOSALS_OPTIONS[dao.proposals],
    DAO_STRUCTURE_OPTIONS[dao.structure],
    DAO_VOTING_POWER_OPTIONS[dao.voting]
  ];

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>Review and launch</h2>
      </div>
      <div className={styles.form}>
        <DaoDetails
          title={dao.displayName}
          flag={dao.flag}
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
        <Link href="/overview" as="/overview">
          <a href="*">
            <Button style={{ textTransform: 'none' }}>
              <span className={styles.gray}> Next:</span> Launch DAO
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
