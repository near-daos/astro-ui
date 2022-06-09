import { DAO } from 'types/dao';
import React, { useEffect, useMemo, VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';

import { useDepositWidth } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';
import { Input } from 'components/inputs/Input';
import { Token } from 'types/token';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Icon } from 'components/Icon';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { formatCurrency } from 'utils/formatCurrency';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import styles from './CreateRoketoStream.module.scss';
import { useRoketoCreateCommission } from './hooks';

interface CreateRoketoStreamProps {
  dao: DAO;
}

function TokenSymbol({ token }: { token: Token }) {
  return (
    <div className={styles.row}>
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
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const CreateRoketoStream: VFC<CreateRoketoStreamProps> = ({ dao }) => {
  const { t } = useTranslation();
  const { register, setValue, getValues, watch } = useFormContext();
  const depositWidth = useDepositWidth();
  const { tokens } = useCustomTokensContext();
  const selectedTokenId = watch('token');
  const commission = useRoketoCreateCommission(selectedTokenId);
  const commissionToken = useMemo(
    () =>
      Object.values(tokens).find(found => found.id === commission.inToken) ??
      null,
    [tokens, commission]
  );

  useEffect(() => {
    setValue('commission', commission.amount);
  }, [commission, setValue]);

  // console.log({ selectedTokenId, commission, commissionToken, tokens });

  const nearToUsd = (tokenBalance: string) => {
    const nearPrice = tokens?.NEAR?.price;

    if (nearPrice) {
      return formatCurrency(parseFloat(tokenBalance) * parseFloat(nearPrice));
    }

    return '';
  };

  const tokenOptions = Object.values(tokens).map(token => ({
    label: token.symbol,
    component: (
      <div className={styles.row}>
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
        <div className={styles.balance}>
          <span
            className={cn({
              [styles.balanceNear]: token.symbol === 'NEAR',
            })}
          >
            {token.balance}
          </span>
          {token.symbol === 'NEAR' && (
            <span>&#8776;&nbsp;{nearToUsd(token.balance)}&nbsp;USD</span>
          )}
        </div>
      </div>
    ),
  }));

  const selectedTokenData = tokens[getValues().token];

  // TODO add commission calculations
  // TODO if listed token, show commission in token, otherwise show in NEAR

  return (
    <div className={styles.root}>
      <div className={styles.amount}>
        <InputWrapper fieldName="amount" label="Amount">
          <Input
            className={cn(styles.inputWrapper)}
            inputStyles={{ width: `${depositWidth}ch`, paddingRight: 4 }}
            type="number"
            min={0}
            placeholder="00.0000"
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
            onChange={v => setValue('token', v, { shouldDirty: true })}
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
      <div className={styles.target}>
        <InputWrapper
          className={styles.inputWrapper}
          fieldName="receiverId"
          label="Target"
        >
          <Input
            type="text"
            min={0}
            placeholder="someuser.near"
            isBorderless
            size="block"
            {...register('receiverId')}
          />
        </InputWrapper>
      </div>

      <div className={styles.commission}>
        <InputWrapper
          className={styles.inputWrapper}
          fieldName="commission"
          label="Commission"
        >
          <div className={styles.inputContainer}>
            <Input
              type="number"
              min={0}
              isBorderless
              size="small"
              readOnly
              {...register('commission')}
            />
            {commissionToken ? <TokenSymbol token={commissionToken} /> : null}
          </div>
        </InputWrapper>
      </div>

      <div className={styles.total}>
        <InputWrapper
          className={styles.inputWrapper}
          fieldName="total"
          label="Total"
        >
          <div className={styles.inputContainer}>
            <Input
              type="number"
              min={0}
              isBorderless
              size="block"
              readOnly
              value={1}
            />
          </div>
        </InputWrapper>
      </div>
    </div>
  );
};
