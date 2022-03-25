import React, { useMemo, VFC } from 'react';
import { useTranslation } from 'next-i18next';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import cn from 'classnames';

import {
  handleValidate,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';

import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';
import { Icon, IconName } from 'components/Icon';
import { Checkbox } from 'components/inputs/Checkbox';
import { Toggle } from 'components/inputs/Toggle';

import styles from './DaoProposalsForm.module.scss';

type SelectorRow = {
  icon: IconName;
  name: string;
  councilVal: boolean;
  publicVal: boolean;
};

type ProposalsStepForm = {
  structure: boolean;
  proposals: boolean;
};

export const DaoProposalsForm: VFC = () => {
  const { t } = useTranslation();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const methods = useForm<ProposalsStepForm>({
    defaultValues: {
      structure: state.proposals.structure === 'groups',
      proposals: state.proposals.proposals === 'open',
    },
    mode: 'onChange',
    resolver: async data => {
      const schema = yup.object().shape({
        // structure: yup.string().required(),
        proposals: yup.boolean().required(),
      });

      return handleValidate<ProposalsStepForm>(schema, data, valid => {
        actions.updateAction({
          proposals: {
            proposals: data.proposals ? 'open' : 'closed',
            structure: data.structure ? 'groups' : 'flat',
            isValid: valid,
          },
        });
      });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = methods;

  const structure = watch('structure');
  const proposals = watch('proposals');

  const onSubmit = (data: ProposalsStepForm) => {
    actions.updateAction({
      proposals: {
        proposals: data.proposals ? 'open' : 'closed',
        structure: data.structure ? 'groups' : 'flat',
        isValid,
      },
    });

    updateQuery('step', 'assets');
  };

  const rows: SelectorRow[] = useMemo(() => {
    return [
      {
        icon: 'proposalGovernance',
        name: 'DAO',
        councilVal: structure,
        publicVal: proposals,
      },
      {
        icon: 'proposalBounty',
        name: 'Bounty',
        councilVal: structure,
        publicVal: proposals,
      },
      {
        icon: 'proposalSendFunds',
        name: 'Transfer',
        councilVal: structure,
        publicVal: proposals,
      },
      {
        icon: 'proposalPoll',
        name: 'Polls',
        councilVal: structure,
        publicVal: proposals,
      },
      {
        icon: 'proposalRemoveMember',
        name: 'Remove members',
        councilVal: structure,
        publicVal: proposals,
      },
      {
        icon: 'proposalAddMember',
        name: 'Add members',
        councilVal: structure,
        publicVal: proposals,
      },
      {
        icon: 'proposalCreateGroup',
        name: 'Create Group',
        councilVal: structure,
        publicVal: proposals,
      },
    ];
  }, [proposals, structure]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <div className={styles.header}>
          <h2>
            {t('createDAO.proposals.proposalsCreation')}{' '}
            <span className={styles.optional}>(Optional)</span>
          </h2>
        </div>
        <p className={styles.description}>
          {t('createDAO.daoLegalStatus.daoKYCDescription')}
        </p>

        <div className={styles.selector}>
          <div className={styles.selectorRow}>
            <div className={cn(styles.selectorCell, styles.mainCell)}>
              &nbsp;
            </div>
            <div className={cn(styles.selectorCell, styles.spaceBetween)}>
              <span className={styles.name}>Councils</span>
              <Toggle
                label=""
                defaultChecked={structure}
                disabled
                className={styles.toggle}
              />
            </div>
            <div className={cn(styles.selectorCell, styles.spaceBetween)}>
              <span className={styles.name}>Public</span>
              <Toggle
                label=""
                {...register('proposals')}
                defaultChecked={proposals}
                className={styles.toggle}
              />
            </div>
          </div>
          {rows.map(({ icon, name, councilVal, publicVal }) => (
            <div className={styles.selectorRow} key={name}>
              <div className={cn(styles.selectorCell, styles.mainCell)}>
                <Icon name={icon} className={styles.icon} />
                <span className={styles.name}>{name}</span>
              </div>
              <div
                className={cn(
                  styles.selectorCell,
                  styles.alignCenter,
                  styles.valueCell
                )}
              >
                <Checkbox
                  label=""
                  checked={councilVal}
                  className={styles.checkbox}
                />
              </div>
              <div
                className={cn(
                  styles.selectorCell,
                  styles.alignCenter,
                  styles.valueCell
                )}
              >
                <Checkbox
                  label=""
                  checked={publicVal}
                  className={styles.checkbox}
                />
              </div>
            </div>
          ))}
        </div>

        <SubmitButton disabled={!isValid} />
      </form>
    </FormProvider>
  );
};
