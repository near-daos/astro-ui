import React from 'react';
import { useTranslation } from 'next-i18next';
import { useStateMachine } from 'little-state-machine';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import cn from 'classnames';
import { Input } from 'components/inputs/Input';

import {
  DEFAULT_CREATE_DAO_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';
import { SubmitStep } from 'astro_2.0/features/CreateDao/types';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import {
  handleValidate,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';
import { getNewDaoParams } from 'astro_2.0/features/CreateDao/helpers';
import { getGasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { useCreateDao } from 'astro_2.0/features/CreateDao/components/hooks';

import { useWalletContext } from 'context/WalletContext';
import styles from './DaoSubmitForm.module.scss';

export function DaoSubmitForm(): JSX.Element {
  const { t } = useTranslation();

  const { actions, state } = useStateMachine({ updateAction });
  const { createDao } = useCreateDao();
  const { accountId } = useWalletContext();

  const methods = useForm<SubmitStep>({
    defaultValues: state.submit,
    mode: 'all',
    resolver: async data => {
      const schema = yup.object().shape({
        gas: getGasValidation(t),
      });

      return handleValidate<SubmitStep>(schema, data, (valid: boolean) =>
        actions.updateAction({
          submit: { ...data, isValid: valid },
        })
      );
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = methods;

  const gasValue = watch('gas');

  const onSubmit = async () => {
    let coverFileName;

    const params = getNewDaoParams(state, accountId, coverFileName);

    await createDao(state.info.address, params);
  };

  function validateWholeForm() {
    const invalidSteps = Object.values(state).filter(item => !item.isValid);

    return invalidSteps.length === 0;
  }

  const isFormValid = validateWholeForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <div className={styles.separator} />
        <div className={styles.footer}>
          <FieldWrapper label="Transaction">
            <h3 className={styles.title}>Create New DAO</h3>
          </FieldWrapper>
          <FieldWrapper
            label="Cost"
            className={styles.cost}
            labelClassName={styles.label}
          >
            <div>
              <strong>6</strong> NEAR
            </div>
          </FieldWrapper>
          <InputWrapper fieldName="gas" label="TGas">
            <div className={styles.row}>
              <Input
                className={cn(styles.inputWrapper, styles.detailsInput, {
                  [styles.error]: errors?.gas,
                })}
                inputStyles={{
                  width: getInputWidth(`${gasValue}`, 8, 6),
                  paddingTop: 2,
                }}
                onClick={e => e.stopPropagation()}
                type="number"
                min={MIN_GAS}
                step={1}
                defaultValue={DEFAULT_CREATE_DAO_GAS}
                max={MAX_GAS}
                isBorderless
                size="block"
                data-testid="gas-input"
                placeholder={`${DEFAULT_CREATE_DAO_GAS}`}
                {...register('gas')}
              />
            </div>
          </InputWrapper>
        </div>
        <div className={styles.submit}>
          <SubmitButton
            disabled={!isValid || !isFormValid}
            isSubmit
            className={styles.submitButton}
          />
        </div>
      </form>
    </FormProvider>
  );
}
