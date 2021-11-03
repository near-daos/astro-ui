import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/input/Input';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Icon } from 'components/Icon';

import { useCustomTokensContext } from 'context/CustomTokensContext';

import styles from './TransferContent.module.scss';

export const TransferContent: FC = () => {
  const { register, setValue, getValues } = useFormContext();

  const { tokens } = useCustomTokensContext();

  const tokenOptions = Object.values(tokens).map(token => ({
    label: token.symbol,
    component: (
      <div className={styles.row}>
        <div className={styles.iconWrapper}>
          {token.symbol === 'NEAR' ? (
            <Icon name="tokenNearBig" />
          ) : (
            <div
              style={{ backgroundImage: `url(${token.icon})` }}
              className={styles.icon}
            />
          )}
        </div>
        <div className={styles.symbol}>{token.symbol}</div>
      </div>
    ),
  }));

  const selectedTokenData = tokens[getValues().selectedToken];

  return (
    <div className={styles.root}>
      <Input
        label="Amount"
        className={cn(styles.inputWrapper, styles.narrow)}
        type="number"
        placeholder="00.00"
        isBorderless
        size="block"
        {...register('amount')}
      />
      <DropdownSelect
        className={styles.select}
        options={tokenOptions}
        label="&nbsp;"
        {...register('token')}
        onChange={v => {
          setValue('token', v, {
            shouldDirty: true,
          });
        }}
        defaultValue={selectedTokenData?.symbol ?? 'NEAR'}
      />
      <Input
        label="Target"
        className={cn(styles.inputWrapper, styles.wide)}
        placeholder="currentdao.sputnik-dao.near"
        isBorderless
        size="block"
        {...register('target')}
      />
    </div>
  );
};
