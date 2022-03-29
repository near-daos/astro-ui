import times from 'lodash/times';
import React, { VFC, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import uniq from 'lodash/uniq';
import * as yup from 'yup';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';

import {
  handleValidate,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';
import { MembersStep } from 'astro_2.0/features/CreateDao/types';
import { useAuthContext } from 'context/AuthContext';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';
import { DaoMemberLine } from './components/DaoMemberLine';

import styles from './DaoMembersForm.module.scss';

export const DaoMembersForm: VFC = () => {
  const { t } = useTranslation();
  const { accountId } = useAuthContext();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const methods = useForm<MembersStep>({
    defaultValues: {
      accounts: uniq(
        state.members.accounts
          ? [accountId, ...state.members.accounts]
          : [accountId]
      ),
    },
    mode: 'onChange',
    resolver: async data => {
      const schema = yup.object().shape({
        accounts: yup.array().of(yup.string().required()).required(),
      });

      const res = await handleValidate<MembersStep>(schema, data, valid =>
        actions.updateAction({ members: { ...data, isValid: valid } })
      );

      return res;
    },
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid },
  } = methods;

  const initialValues = getValues();

  const [linksCount, setLinksCount] = useState<number>(
    initialValues?.accounts?.length ?? 0
  );

  function addLink() {
    setLinksCount(count => count + 1);
  }

  function removeLink(index: number) {
    const accounts = getValues('accounts');

    accounts.splice(index, 1);

    setValue('accounts', accounts, { shouldValidate: true });
    setLinksCount(count => count - 1);
  }

  function renderLinkFormEls() {
    return times(linksCount, index => (
      <DaoMemberLine key={index} index={index} removeLink={removeLink} />
    ));
  }

  const onSubmit = (data: MembersStep) => {
    actions.updateAction({ members: { ...data, isValid } });

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
          <StepCounter total={6} current={4} />
        </div>
        <p className={styles.description}>
          {t('createDAO.daoMembersForm.addMembersDescription')}
        </p>
        <section className={styles.links}>
          {renderLinkFormEls()}

          <Button
            className={styles.link}
            onClick={addLink}
            variant="transparent"
          >
            <span className={styles.socialText} />
            <Icon className={styles.addBtn} name="buttonAdd" width={24} />
          </Button>
        </section>

        <SubmitButton disabled={!isValid} />
      </form>
    </FormProvider>
  );
};
