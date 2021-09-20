import { useModal } from 'components/modal';
import * as Typography from 'components/Typography';
import { DaoTemplateCard } from 'features/create-dao/components/template/DaoTemplateCard';
import {
  DaoTemplateModal,
  DaoTemplateModalProps
} from 'features/create-dao/components/template/DaoTemplateModal';
import { useRouter } from 'next/router';
import {
  DAO_PROPOSALS_OPTIONS,
  DAO_STRUCTURE_OPTIONS,
  DAO_TEMPLATES,
  DAO_VOTING_POWER_OPTIONS
} from 'features/create-dao/components/steps/data';
import {
  DAOFormValues,
  DAOTemplate
} from 'features/create-dao/components/steps/types';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './foundation.module.scss';

export function FoundationView(): JSX.Element {
  const [showModal] = useModal<DaoTemplateModalProps>(DaoTemplateModal);
  const router = useRouter();
  const { setValue } = useFormContext<DAOFormValues>();

  const handleClick = useCallback(
    async (template: DAOTemplate) => {
      const result = await showModal({
        variant: template.variant,
        title: template.title,
        options: [
          DAO_PROPOSALS_OPTIONS[template.proposals],
          DAO_STRUCTURE_OPTIONS[template.structure],
          DAO_VOTING_POWER_OPTIONS[template.voting]
        ],
        description: template.description
      });

      const [confirm] = (result as unknown) as [boolean];

      if (confirm) {
        setValue('voting', template.voting);
        setValue('proposals', template.proposals);
        setValue('structure', template.structure);
        await router.push('/create-dao/settings');
      }
    },
    [router, setValue, showModal]
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
            key={template.variant}
            title={template.title}
            description={template.description}
            variant={template.variant}
            disabled={template.disabled}
            onClick={() => handleClick(template)}
          />
        ))}
      </div>
    </div>
  );
}
