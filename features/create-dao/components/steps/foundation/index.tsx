import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';

import * as Typography from 'components/Typography';
import { DaoTemplateCard } from 'features/create-dao/components/template/DaoTemplateCard';
import { DAO_TEMPLATES } from 'features/create-dao/components/steps/data';
import {
  DAOFormValues,
  DAOTemplate
} from 'features/create-dao/components/steps/types';

import styles from './foundation.module.scss';

export function FoundationView(): JSX.Element {
  const router = useRouter();
  const { setValue } = useFormContext<DAOFormValues>();

  const handleClick = useCallback(
    async (template: DAOTemplate) => {
      setValue('voting', template.voting);
      setValue('proposals', template.proposals);
      setValue('structure', template.structure);
      await router.push('/create-dao/settings');
    },
    [router, setValue]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>A DAO is a new way for people to organize and work together. </h1>
        <Typography.Subtitle size={1}>
          What are you starting?
        </Typography.Subtitle>
      </div>
      <div className={styles.cards}>
        {DAO_TEMPLATES.map(template => (
          <DaoTemplateCard
            template={template}
            key={template.variant}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}
