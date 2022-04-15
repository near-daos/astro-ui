import React, { VFC } from 'react';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';
import { useTranslation } from 'next-i18next';

import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';

import {
  getInitialCreationPermissions,
  SelectorRow,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';
import { PermissionsSelector } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/PermissionsSelector';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';

import styles from './DaoProposalCreationForm.module.scss';

export const DaoProposalCreationForm: VFC = () => {
  const { t } = useTranslation();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const onSubmit = (data: SelectorRow[]) => {
    actions.updateAction({
      proposals: { data, isValid: true },
    });

    updateQuery('step', 'voting');
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>{t('createDAO.proposals.proposalsCreation')}</h2>
        <StepCounter total={7} current={5} />
      </div>
      <p className={styles.description}>
        {t('createDAO.proposals.description')}
      </p>
      <PermissionsSelector
        className={styles.selector}
        contentClassName={styles.content}
        headerClassName={styles.control}
        controlClassName={styles.controlBtn}
        controlLabel="Next Step"
        disableNewProposal={false}
        onSubmit={onSubmit}
        initialData={
          state.proposals.data ||
          getInitialCreationPermissions({
            policy: {
              roles: [
                { name: 'council', permissions: ['*:*'] },
                { name: 'all', permissions: ['*:AddProposal'] },
              ],
            },
          })
        }
      />
    </div>
  );
};
