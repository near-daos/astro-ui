import times from 'lodash/times';
import React, { VFC, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';

import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';
import {
  handleValidate,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';
import { LinksStep } from 'astro_2.0/features/CreateDao/types';

import { VALID_URL_REGEXP } from 'constants/regexp';

import { DaoLinkLine } from './components/DaoLinkLine';

import styles from './DaoLinksForm.module.scss';

export const DaoLinksForm: VFC = () => {
  const { t } = useTranslation();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const methods = useForm<LinksStep>({
    defaultValues: state.links,
    mode: 'all',
    resolver: async data => {
      const schema = yup.object().shape({
        websites: yup.array().of(
          yup
            .string()
            .matches(VALID_URL_REGEXP, {
              message: t('createDAO.daoIncorrectURLError'),
            })
            .required('Required')
        ),
      });

      const res = await handleValidate<LinksStep>(schema, data, valid =>
        actions.updateAction({ links: { ...data, isValid: valid } })
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
    initialValues?.websites?.length ?? 0
  );

  function addLink() {
    setLinksCount(count => count + 1);
  }

  function removeLink(index: number) {
    const websites = getValues('websites');

    websites.splice(index, 1);

    setValue('websites', websites);
    setLinksCount(count => count - 1);
  }

  function renderLinkFormEls() {
    return times(linksCount, index => (
      <DaoLinkLine key={index} index={index} removeLink={removeLink} />
    ));
  }

  const onSubmit = (data: LinksStep) => {
    actions.updateAction({ links: { ...data, isValid } });

    updateQuery('step', 'groups');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <div className={styles.header}>
          <h2>
            {t('createDAO.daoLinksForm.daoLinks')}{' '}
            <span className={styles.optional}>({t('createDAO.optional')})</span>
          </h2>
          <StepCounter total={8} current={3} />
        </div>
        <p className={styles.description}>
          {t('createDAO.daoLinksForm.daoLinksDescription')}
        </p>

        <section className={styles.links}>
          {renderLinkFormEls()}

          <Button
            className={styles.link}
            onClick={addLink}
            variant="transparent"
          >
            <Icon
              className={styles.socialIcon}
              name="socialPlaceholder"
              width={32}
            />
            <span className={styles.socialText}>https://</span>
            <Icon className={styles.addBtn} name="buttonAdd" width={24} />
          </Button>
        </section>

        <SubmitButton disabled={!isValid} />
      </form>
    </FormProvider>
  );
};
