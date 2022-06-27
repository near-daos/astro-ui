import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';

import styles from './UpdateVotePolicyToWeightVoting.module.scss';

export const UpdateVotePolicyToWeightVoting: VFC = () => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext();

  const threshold = watch('threshold');

  console.log(threshold);

  return (
    <div className={styles.root}>
      <InputWrapper
        fieldName="threshold"
        label={t('proposalCard.updateVotePolicyToWeightVoting.threshold')}
        flex
        className={styles.inputWrapper}
      >
        <div className={styles.input}>
          <Input
            placeholder={t(
              'proposalCard.updateVotePolicyToWeightVoting.amount'
            )}
            isBorderless
            size="auto"
            inputStyles={{
              padding: '10.5px 0',
              width: getInputWidth(threshold, 30, 30),
            }}
            {...register('threshold')}
          />
        </div>
      </InputWrapper>
    </div>
  );
};
