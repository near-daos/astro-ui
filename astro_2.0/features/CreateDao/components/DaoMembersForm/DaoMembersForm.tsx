import React, { VFC } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import uniqBy from 'lodash/uniqBy';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';

import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';
import { useWalletContext } from 'context/WalletContext';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';
import { DaoMemberLine } from 'astro_2.0/features/CreateDao/components/DaoMembersForm/components/DaoMemberLine';
import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';

import styles from './DaoMembersForm.module.scss';

type Form = { accounts: { name: string; role: string }[]; groups: string };

export const DaoMembersForm: VFC = () => {
  const { t } = useTranslation();
  const { accountId, nearService } = useWalletContext();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const methods = useForm<Form>({
    defaultValues: {
      accounts: uniqBy(
        state.members.accounts
          ? [
              { name: accountId, role: state.groups.items[0]?.name || '' },
              ...state.members.accounts.map(item => ({
                name: item.name,
                role: item.role,
              })),
            ]
          : [{ name: accountId, role: state.groups.items[0].name || '' }],
        item => item.name
      ),
    },
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        accounts: yup.array().of(
          yup.object().shape({
            name: yup
              .string()
              .test({
                name: 'notValidNearAccount',
                exclusive: true,
                message: 'Only valid near accounts are allowed',
                test: async value => validateUserAccount(value, nearService),
              })
              .required('Required'),
            role: yup.string().test({
              name: 'notValidRole',
              exclusive: true,
              message: 'Select user role',
              test: value => value?.trim() !== '',
            }),
          })
        ),
        groups: yup.string().test({
          name: 'emptyGroups',
          exclusive: true,
          message:
            'There are still empty groups in your DAO. Each group should have at least one member.',
          test: async (value, context) => {
            const selectedGroups = context.parent.accounts.map(
              (item: { role: string }) => item.role
            );
            const existingGroups = state.groups.items
              .map(item => item.name)
              .filter(item => item !== 'all');

            return (
              existingGroups.filter(item => !selectedGroups.includes(item))
                .length === 0
            );
          },
        }),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'accounts',
  });

  const onSubmit = (data: Form) => {
    actions.updateAction({
      members: { accounts: data.accounts, isValid },
    });

    updateQuery('step', 'proposals');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <div className={styles.header}>
          <h2>
            {t('createDAO.daoMembersForm.addMembers')}{' '}
            <span className={styles.optional}>({t('createDAO.optional')})</span>
          </h2>

          <StepCounter total={8} current={5} />
        </div>

        <p className={styles.description}>
          {t('createDAO.daoMembersForm.addMembersDescription')}
        </p>

        {errors.groups && (
          <p className={cn(styles.description, styles.error)}>
            {errors.groups.message}
          </p>
        )}

        <div className={styles.row}>
          <div className={styles.column}>
            <section className={styles.links}>
              {fields.map((item, index) => {
                return (
                  <DaoMemberLine
                    key={item.name}
                    item={item}
                    index={index}
                    onRemove={() => {
                      remove(index);

                      methods.trigger('groups');
                    }}
                    canBeRemoved={item.name !== accountId}
                  />
                );
              })}

              <Button
                className={styles.link}
                onClick={() => append({ name: '', role: '' })}
                variant="transparent"
              >
                <div className={styles.linkUser}>
                  {t('createDAO.daoMembersForm.newMemberNamePlaceholder')}
                </div>

                <div className={styles.linkGroup}>
                  <span>
                    {t('createDAO.daoMembersForm.newMemberRolePlaceholder')}
                  </span>

                  <Icon name="buttonArrowDown" />
                </div>

                <Icon className={styles.addBtn} name="buttonAdd" width={24} />
              </Button>
            </section>

            <SubmitButton className={styles.submit} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
