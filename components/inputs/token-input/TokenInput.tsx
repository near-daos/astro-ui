import React, { FC, useCallback, useRef } from 'react';
import cn from 'classnames';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Icon } from 'components/Icon';
import { Input } from 'components/inputs/input/Input';

import { Tokens } from 'context/CustomTokensContext';

import { useNearPrice } from 'hooks/useNearPrice';

import styles from './token-input.module.scss';

interface TokenInputProps {
  tokens: Tokens;
  onTokenSelect: (v?: string) => void;
  selectedToken: string;
  inputProps: unknown;
  amount: number;
  error?: boolean;
  success?: boolean;
  name: string;
}

export const TokenInput: FC<TokenInputProps> = ({
  inputProps,
  amount,
  tokens,
  onTokenSelect,
  selectedToken,
  error,
  success,
  name,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputClick = useCallback(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

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
        <div>{token.symbol}</div>
      </div>
    ),
  }));

  const selectedTokenData = tokens[selectedToken];
  const nearPrice = useNearPrice();
  const cost = selectedTokenData?.symbol === 'NEAR' ? nearPrice * amount : 0;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.label}>Token</span>
        <span className={styles.sublabel}>
          Balance: {selectedTokenData?.balance || 0} {selectedTokenData?.symbol}
        </span>
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className={cn(styles.inputContainer, {
          [styles.error]: !!error,
          [styles.success]: success,
        })}
        onClick={handleInputClick}
      >
        <DropdownSelect
          className={styles.select}
          options={tokenOptions}
          onChange={onTokenSelect}
          defaultValue={selectedTokenData?.symbol}
        />
        <div className={styles.inputWrapper}>
          <Input
            className={styles.input}
            size="block"
            name={name}
            type="number"
            lang="en-US"
            step="0.1"
            min="0.1"
            {...inputProps}
            ref={inputRef}
          />
          {selectedTokenData?.symbol === 'NEAR' && (
            <div className={styles.sub}>
              &nbsp;
              {`≈$${cost?.toFixed(2) ?? 0}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
