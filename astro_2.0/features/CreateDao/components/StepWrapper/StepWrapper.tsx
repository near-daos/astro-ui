import React, { FC, useCallback, useMemo } from 'react';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';
import { useMount } from 'react-use';
import dynamic from 'next/dynamic';
import { useWalletContext } from 'context/WalletContext';

import { CreationProgress } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/CreateToken/components/CreationProgress';

import { useTranslation } from 'next-i18next';
import { Button } from 'components/button/Button';
import {
  getInitialValues,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';

import styles from './StepWrapper.module.scss';

const CustomEdit = dynamic(
  import('astro_2.0/features/CreateDao/components/CustomEdit'),
  {
    ssr: false,
  }
);

const options = [
  {
    label: 'DAO Info',
    value: 'info',
  },
  {
    label: 'KYC',
    value: 'kyc',
  },
  {
    label: 'Links & Socials',
    value: 'links',
  },
  {
    label: 'Add groups',
    value: 'groups',
  },
  {
    label: 'Add members',
    value: 'members',
  },
  {
    label: 'Proposal Creation',
    value: 'proposals',
  },
  {
    label: 'Voting permissions',
    value: 'voting',
  },
  {
    label: 'Create DAO assets',
    value: 'assets',
  },
];

export const StepWrapper: FC = ({ children }) => {
  const { t } = useTranslation();
  const { accountId } = useWalletContext();
  const { query, updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { state, actions } = useStateMachine({ updateAction });

  const steps = useMemo(() => {
    return options.map(item => {
      const key = item.value;

      const form = state[key];

      return {
        ...item,
        isComplete: form?.isValid,
        isCurrent: query.step === item.value,
      };
    });
  }, [query.step, state]);

  const handleClick = useCallback(
    (value: string) => {
      updateQuery('step', value);
    },
    [updateQuery]
  );

  const handleReset = useCallback(() => {
    sessionStorage.removeItem('__LSM__');
    actions.updateAction(getInitialValues(accountId, state.assets.defaultFlag));
  }, [accountId, actions, state.assets.defaultFlag]);

  useMount(() => {
    updateQuery('step', query.step);

    if (state.members.accounts[0]?.name !== accountId) {
      handleReset();
    }
  });

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1>{t('createDAO.createNewDAO')}</h1>

        <div className={styles.headerControls}>
          {query.step === 'assets' && (
            <CustomEdit className={styles.customEdit} />
          )}
          <Button
            variant="tertiary"
            className={styles.resetButton}
            size="small"
            onClick={() => {
              handleReset();
              handleClick('info');
            }}
          >
            Reset Steps
          </Button>
        </div>
      </header>
      <CreationProgress
        steps={steps}
        className={styles.progress}
        onItemClick={handleClick}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
