import React, { VFC } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import uniqBy from 'lodash/uniqBy';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';

import { updateAction } from 'astro_2.0/features/CreateDao/components/helpers';
import { useWalletContext } from 'context/WalletContext';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';
import { DaoMemberLine } from 'astro_2.0/features/CreateDao/components/DaoMembersForm/components/DaoMemberLine';
import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';

import styles from './DaoMembersForm.module.scss';

type Form = { accounts: { account: string }[] };

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
              { account: accountId },
              ...state.members.accounts.map(item => ({ account: item })),
            ]
          : [{ account: accountId }],
        item => item.account
      ),
    },
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        accounts: yup.array().of(
          yup.object().shape({
            account: yup
              .string()
              .test({
                name: 'notValidNearAccount',
                exclusive: true,
                message: 'Only valid near accounts are allowed',
                test: async value => validateUserAccount(value, nearService),
              })
              .required('Required'),
          })
        ),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'accounts',
  });

  const onSubmit = (data: Form) => {
    actions.updateAction({
      members: { accounts: data.accounts.map(item => item.account), isValid },
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
          <StepCounter total={7} current={4} />
        </div>
        <p className={styles.description}>
          {t('createDAO.daoMembersForm.addMembersDescription')}
        </p>
        <section className={styles.links}>
          {fields.map((item, index) => {
            return (
              <DaoMemberLine
                key={item.id}
                item={item}
                index={index}
                onRemove={() => remove(index)}
              />
            );
          })}
          <Button
            className={styles.link}
            onClick={() => append({ account: '' })}
            variant="transparent"
          >
            <span className={styles.socialText} />
            <Icon className={styles.addBtn} name="buttonAdd" width={24} />
          </Button>
        </section>
        <SubmitButton />
      </form>
    </FormProvider>
  );
};
