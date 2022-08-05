import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { DebouncedInput, Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { useDaoCustomTokens } from 'context/DaoTokensContext';

import styles from './TransferFundsContent.module.scss';

export const TransferFundsContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();
  const { tokens } = useDaoCustomTokens();
  const tokensOptions = Object.values(tokens);

  return (
    <div className={styles.root}>
      {tokensOptions
        .filter(token => Number(token.balance) > 0)
        .map(token => {
          const amountField = `${token.symbol}_amount`;
          const targetField = `${token.symbol}_target`;

          return (
            <div key={token.symbol} className={styles.row}>
              <InputWrapper
                className={styles.amount}
                fieldName={amountField}
                label={t('proposalCard.proposalAmount')}
              >
                <Input
                  // defaultValue={token.balance}
                  className={cn(styles.inputWrapper, styles.narrow)}
                  inputStyles={{
                    width: `${7}ch`,
                    padding: 0,
                    height: 24,
                    marginRight: 18,
                  }}
                  type="number"
                  min={0}
                  placeholder="00.00"
                  isBorderless
                  size="block"
                  {...register(amountField)}
                />
              </InputWrapper>
              <div className={styles.tokenDetails}>
                <Button
                  variant="tertiary"
                  size="small"
                  className={styles.maxButton}
                  onClick={() => {
                    let max = Number(token.balance);

                    if (token.symbol === 'NEAR') {
                      const maxPossibleValue = Number(max) - 6;

                      if (maxPossibleValue <= 0) {
                        max = 0;
                      } else {
                        max = maxPossibleValue;
                      }
                    }

                    setValue(amountField, Number(max.toFixed(5)), {
                      shouldValidate: true,
                    });
                  }}
                >
                  MAX
                </Button>
                <div className={styles.iconWrapper}>
                  {token.symbol === 'NEAR' ? (
                    <Icon name="tokenNearBig" />
                  ) : (
                    <div
                      className={styles.icon}
                      style={{
                        backgroundImage: `url(${token.icon})`,
                      }}
                    />
                  )}
                </div>
                <div className={styles.symbol}>{token.symbol}</div>
              </div>
              <InputWrapper
                className={styles.target}
                fieldName={targetField}
                label={t('proposalCard.proposalTarget')}
                flex
              >
                <DebouncedInput
                  // defaultValue={initialTarget}
                  className={cn(styles.inputWrapper, styles.wide)}
                  placeholder={t('proposalCard.proposalTargetPlaceholder')}
                  isBorderless
                  size="block"
                  inputStyles={{
                    padding: 0,
                    height: 24,
                  }}
                  {...register(targetField)}
                  onValueChange={val =>
                    setValue(targetField, val, { shouldValidate: true })
                  }
                />
              </InputWrapper>
            </div>
          );
        })}
    </div>
  );
};
