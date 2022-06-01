import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';

import styles from './ContractAcceptanceContent.module.scss';

interface ContractAcceptanceContentProps {
  tokenId: string;
}

export const ContractAcceptanceContent: FC<ContractAcceptanceContentProps> = ({
  tokenId,
}) => {
  const { register, watch } = useFormContext();

  const currentValue = watch('unstakingPeriod');
  const token = watch('token');

  return (
    <div className={styles.root}>
      <InfoBlockWidget label="Token ID" value={token || tokenId} />
      <InputWrapper
        fieldName="unstakingPeriod"
        label="Unstaking Period"
        flex
        className={styles.inputWrapper}
      >
        <div className={styles.input}>
          <Input
            placeholder="hours"
            isBorderless
            size="auto"
            inputStyles={{
              padding: '10.5px 0',
              width: getInputWidth(currentValue, 20),
            }}
            {...register('unstakingPeriod')}
          />
          {currentValue && <div className={styles.suffix}>hours</div>}
        </div>
      </InputWrapper>
    </div>
  );
};
