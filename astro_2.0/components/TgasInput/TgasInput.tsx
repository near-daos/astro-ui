import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';

import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';
import { Input } from 'components/inputs/Input';

import styles from './TgasInput.module.scss';

interface TgasInputProps {
  readOnly?: boolean;
  defaultValue?: string;
  className?: string;
}

export const TgasInput: FC<TgasInputProps> = ({
  readOnly,
  defaultValue,
  className,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const gas = watch('gas')?.toString();

  return (
    <InputWrapper
      className={cn(styles.detailsItem, className)}
      labelClassName={cn(styles.inputLabel, className)}
      fieldName="gas"
      label="TGas"
    >
      <div className={styles.row}>
        <Input
          className={cn(styles.inputWrapper, styles.detailsInput, {
            [styles.error]: errors?.gas,
            [styles.readOnly]: readOnly,
          })}
          inputStyles={{
            width: getInputWidth(gas, 8, 6),
          }}
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          type="number"
          min={MIN_GAS}
          step={1}
          readOnly={readOnly}
          defaultValue={defaultValue}
          max={MAX_GAS}
          isBorderless
          size="block"
          data-testid="gas-input"
          placeholder={`${DEFAULT_PROPOSAL_GAS}`}
          {...register('gas')}
        />
      </div>
    </InputWrapper>
  );
};
