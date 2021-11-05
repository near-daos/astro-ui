import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from 'components/inputs/input/Input';
import { Group } from 'features/vote-policy/components/group';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './ChangePolicyContent.module.scss';

export const ChangePolicyContent: FC = () => {
  const { register } = useFormContext();

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <InputWrapper fieldName="group" label="Group">
          <div className={styles.value}>
            <Group name="All groups" />
          </div>
        </InputWrapper>
        <InputWrapper fieldName="group" label="Who votes">
          <div className={styles.value}>Person</div>
        </InputWrapper>
        <InputWrapper fieldName="amount" label="Consensus" alignRight>
          <Input
            {...register('amount')}
            placeholder="0"
            isBorderless
            textAlign="left"
            type="number"
            size="small"
            className={styles.amount}
          />
        </InputWrapper>
        <div className={styles.percent}>%</div>
      </div>
    </div>
  );
};
