import { DAO } from 'types/dao';
import React, { useEffect, useMemo, VFC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import Decimal from 'decimal.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { useDepositWidth } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/hooks';
import { Input } from 'components/inputs/Input';
import { Token } from 'types/token';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { Icon } from 'components/Icon';
import { TextArea } from 'components/inputs/TextArea';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { formatCurrency } from 'utils/formatCurrency';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import styles from './CreateRoketoStream.module.scss';
import { useRoketoReceipt } from './hooks';

interface CreateRoketoStreamProps {
  dao: DAO;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const CreateRoketoStream: VFC<CreateRoketoStreamProps> = ({ dao }) => {
  const { t } = useTranslation();
  const { register, setValue, getValues, watch } = useFormContext();
  const depositWidth = useDepositWidth();
  const { tokens } = useCustomTokensContext();
  const selectedTokenId = watch('tokenId');
  const selectedToken = useMemo(
    () =>
      Object.values(tokens).find(found => found.id === selectedTokenId) ?? null,
    [tokens, selectedTokenId]
  );

  // TODO add check for storage_deposit for dao account and target account

  const shouldDepositForDao = watch('shouldDepositForDao');
  const shouldDepositForTarget = watch('shouldDepositForReceiver');

  const { total, positions } = useRoketoReceipt({
    amountToStream: new Decimal(watch('amount') || '0')
      .mul(10 ** (selectedToken?.decimals ?? 24))
      .toFixed(),
    tokenId: selectedToken?.id || 'NEAR',
    storageDeposit: {
      forSender: shouldDepositForDao ?? true,
      forRecipient: shouldDepositForTarget ?? false,
    },
  });

  useEffect(() => {
    setValue('receipt', { total, positions });
  }, [total, positions, setValue]);

  const toUsd = (token: Token) => {
    if (token.price) {
      return formatCurrency(
        parseFloat(token.balance) * parseFloat(token.price)
      );
    }

    return '';
  };

  const tokenOptions = Object.values(tokens).map(token => ({
    value: token.id,
    label: (
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
          {token.price && <span>&#8776;&nbsp;{toUsd(token)}&nbsp;USD</span>}
        </div>
      </div>
    ),
  }));

  const selectedTokenData = tokens[getValues().token];

  return (
    <div className={styles.root}>
      <div className={styles.target}>
        <InputWrapper
          className={styles.inputWrapper}
          fieldName="receiverId"
          label="Receiver"
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
            {...register('tokenId')}
            onChange={v => setValue('tokenId', v, { shouldDirty: true })}
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
      <div className={styles.comment}>
        <InputWrapper
          className={styles.inputWrapper}
          fieldName="comment"
          label="Comment for the stream"
        >
          <TextArea
            size="block"
            isBorderless
            textAlign="left"
            placeholder="This text will be saved in the created stream"
            resize="none"
            maxLength={80}
            minRows={2}
            maxRows={2}
            {...register('comment')}
          />
        </InputWrapper>
      </div>

      <div className={styles.commission}>
        {positions.length !== 0 && (
          <InputWrapper
            className={styles.inputWrapper}
            fieldName="commission"
            label="Receipt"
          >
            <div className={styles.receipt}>
              {positions.map(position => {
                const token = tokens[position.token];

                return (
                  <React.Fragment key={`${position.token}-${position.amount}`}>
                    <span>{position.description}</span>
                    <span className={styles.receiptAmount}>
                      {formatNearAmount(position.amount, token.decimals)}
                    </span>
                    <span>{token.symbol}</span>
                  </React.Fragment>
                );
              })}
            </div>
          </InputWrapper>
        )}
      </div>

      <div className={styles.total}>
        {Object.values(total).length !== 0 && (
          <InputWrapper
            className={styles.inputWrapper}
            fieldName="total"
            label="Total it will be charged off"
          >
            <div className={styles.totalLines}>
              {Object.entries(total).map(([tokenId, amount]) => {
                const token = tokens[tokenId];

                return (
                  <React.Fragment key={tokenId}>
                    <span className={styles.totalAmount}>
                      {formatNearAmount(amount, token.decimals)}
                    </span>
                    <span>{token.symbol}</span>
                  </React.Fragment>
                );
              })}
            </div>
          </InputWrapper>
        )}
      </div>
    </div>
  );
};
