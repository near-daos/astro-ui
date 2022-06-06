import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';

import styles from './DeployStakingContractContent.module.scss';

export const DeployStakingContractContent: VFC = () => {
  const { t } = useTranslation();
  const { register, watch } = useFormContext();

  const currentValue = watch('unstakingPeriod');
  const token = watch('token');

  return (
    <div className={styles.root}>
      <InfoBlockWidget
        label={t('proposalCard.deployStakingContract.tokenId')}
        value={token}
      />
      <InputWrapper
        fieldName="unstakingPeriod"
        label={t('proposalCard.deployStakingContract.unstakingPeriod')}
        flex
        className={styles.inputWrapper}
      >
        <div className={styles.input}>
          <Input
            placeholder={t('proposalCard.deployStakingContract.hours')}
            isBorderless
            size="auto"
            inputStyles={{
              padding: '10.5px 0',
              width: getInputWidth(currentValue, 20),
            }}
            {...register('unstakingPeriod')}
          />
          {currentValue && (
            <div className={styles.suffix}>
              {t('proposalCard.deployStakingContract.hours')}
            </div>
          )}
        </div>
      </InputWrapper>
    </div>
  );
};
