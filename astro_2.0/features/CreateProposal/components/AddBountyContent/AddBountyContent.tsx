import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Input } from 'components/inputs/Input';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import { getAmountFieldWidth } from './utils';

import styles from './AddBountyContent.module.scss';

export const AddBountyContent: FC = () => {
  const { t } = useTranslation();
  const { register, setValue, getValues, watch } = useFormContext();
  const { tokens } = useDaoCustomTokens();
  const amount = watch('amount');

  const tokenOptions = Object.values(tokens).map(token => ({
    value: token.tokenId || token.symbol,
    label: (
      <Tooltip
        className={styles.row}
        overlay={<span>{token.tokenId || token.symbol}</span>}
      >
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
          <div className={styles.symbol}>
            <div>{token.symbol}</div>
            <div className={styles.sub}>{token.tokenId}</div>
          </div>
          <div className={styles.balance}>{token.balance}</div>
        </div>
      </Tooltip>
    ),
  }));

  const selectedTokenData = tokens[getValues().token];

  const onTokenChange = useCallback(
    v => {
      setValue('token', v, {
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const onTokenAmountUpdate = useCallback(event => {
    const intRx = /\d/;

    if (event.key.length > 1 || intRx.test(event.key)) {
      return;
    }

    event.preventDefault();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.inline}>
        <InputWrapper
          fieldName="amount"
          label={t('proposalCard.proposalAmount')}
        >
          <Input
            className={cn(styles.inputWrapper, styles.narrow)}
            type="number"
            inputStyles={{
              width: `${getAmountFieldWidth(amount)}ch`,
              paddingRight: 4,
            }}
            placeholder="00.0000"
            min={0}
            isBorderless
            size="block"
            {...register('amount')}
          />
        </InputWrapper>
        {Object.values(tokens).length ? (
          <DropdownSelect
            className={styles.select}
            options={tokenOptions}
            label="&nbsp;"
            {...register('token')}
            onChange={onTokenChange}
            defaultValue={
              selectedTokenData?.symbol ?? getValues().token ?? 'NEAR'
            }
          />
        ) : (
          <div className={styles.loaderWrapper}>
            <LoadingIndicator />
          </div>
        )}
      </div>
      <div className={styles.divider} />
      <div className={styles.inline}>
        <InputWrapper
          fieldName="slots"
          label={t('proposalCard.bountyAvailableClaims')}
        >
          <Input
            type="number"
            className={styles.inputWrapper}
            placeholder="0"
            min={1}
            step={1}
            pattern="/d+"
            isBorderless
            size="small"
            {...register('slots')}
            onKeyDown={onTokenAmountUpdate}
          />
        </InputWrapper>
        <div className={styles.divider} />
        <InputWrapper
          fieldName="deadlineThreshold"
          label={t('proposalCard.bountyDaysToComplete')}
        >
          <Input
            type="number"
            className={styles.inputWrapper}
            placeholder="0"
            min={1}
            isBorderless
            size="small"
            {...register('deadlineThreshold')}
          />
        </InputWrapper>
      </div>
    </div>
  );
};
