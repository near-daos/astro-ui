import React, { VFC } from 'react';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';
import { useTranslation } from 'next-i18next';

import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';

import {
  getInitialVotingPermissions,
  SelectorRow,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';
import { PermissionsSelector } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/PermissionsSelector';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';

import styles from './DaoVotingPermissionsForm.module.scss';

export const DaoVotingPermissionsForm: VFC = () => {
  const { t } = useTranslation();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const onSubmit = (data: SelectorRow[]) => {
    actions.updateAction({
      voting: { data, isValid: true },
    });

    updateQuery('step', 'assets');
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>{t('createDAO.voting.votingPermissions')}</h2>

        <StepCounter total={8} current={7} />
      </div>

      <p className={styles.description}>{t('createDAO.voting.description')}</p>

      <PermissionsSelector
        disableNewProposal={false}
        className={styles.selector}
        contentClassName={styles.content}
        headerClassName={styles.control}
        controlClassName={styles.controlBtn}
        controlLabel="Next Step"
        onSubmit={onSubmit}
        initialData={
          state.voting.data ||
          getInitialVotingPermissions({
            policy: {
              roles: state.groups.items.map(role =>
                role?.slug === 'all'
                  ? {
                      name: role.name,
                      slug: role?.slug,
                      permissions: ['*:-'],
                      kind: 'Everyone',
                    }
                  : {
                      name: role.name,
                      slug: role?.slug,
                      permissions: ['*:*'],
                      kind: 'Group',
                    }
              ),
            },
          })
        }
      />
    </div>
  );
};
