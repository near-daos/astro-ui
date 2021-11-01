import React from 'react';
import { NextPage } from 'next';
import { FormProvider, useForm } from 'react-hook-form';
import { DaoName } from 'astro_2.0/features/CreateDao/components/units/DaoName';
import { DaoLinks } from 'astro_2.0/features/CreateDao/components/units/DaoLinks';
import { DaoRules } from 'astro_2.0/features/CreateDao/components/units/DaoRules';
import { DaoFlag } from 'astro_2.0/features/CreateDao/components/units/DaoFlag';
import { DaoPreview } from 'astro_2.0/features/CreateDao/components/units/DaoPreview';
import { DaoSubmit } from 'astro_2.0/features/CreateDao/components/units/DaoSubmit';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/units/types';

import styles from './CreateDaoPage.module.scss';

const CreateDaoPage: NextPage<{ step: string }> = () => {
  const methods = useForm<DAOFormValues>({
    defaultValues: {
      proposals: undefined,
      structure: undefined,
      voting: undefined,
      websites: [],
      address: undefined,
      purpose: undefined,
      displayName: undefined,
      flag: undefined,
      flagPreview: undefined,
    },
  });

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.breadcrumbs}>Create new DAO</div>
        <div className={styles.header}>
          <h1>
            A&nbsp;DAO is&nbsp;a&nbsp;new way for people to&nbsp;organize and
            work together.
          </h1>
        </div>
      </div>
      <FormProvider {...methods}>
        <DaoName />
        <DaoLinks />
        <DaoRules />
        <DaoFlag />
        <DaoPreview />
        <DaoSubmit />
      </FormProvider>
    </div>
  );
};

export default CreateDaoPage;
