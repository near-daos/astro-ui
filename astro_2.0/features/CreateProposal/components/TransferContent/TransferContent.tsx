import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/input/Input';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Icon } from 'components/Icon';

import { Token } from 'types/token';

import styles from './TransferContent.module.scss';

export const TransferContent: FC = () => {
  const { register, setValue, getValues } = useFormContext();

  // todo - get it from context
  const tokens = ({
    near: {
      tokenId: '',
      symbol: 'NEAR',
      balance: '5603284827495119399999994',
      decimals: 24,
    },
    kaleinik: {
      tokenId: 'kaleinik.tokenfactory.testnet',
      spec: 'ft-1.0.0',
      name: 'kaleinik-token',
      symbol: 'kaleinik',
      icon:
        'data:image/jpeg;base64,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',
      reference: null,
      referenceHash: null,
      decimals: 2,
      balance: '3850',
    },
  } as unknown) as Record<string, Token>;

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
