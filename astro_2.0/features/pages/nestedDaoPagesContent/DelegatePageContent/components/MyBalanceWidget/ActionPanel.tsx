import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ControlledInput } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/ControlledInput';
import { Button } from 'components/button/Button';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/MyBalanceWidget/MyBalanceWidget.module.scss';
import { useWalletContext } from 'context/WalletContext';
import { useDelegatePageContext } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageContext';
import { useTriggerUpdate } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';
import { formatValueToYokto } from 'utils/format';

type Context = 'stake' | 'unstake' | null;

interface Props {
  context: Context;
  availableBalance: number;
  stakedBalance: number;
  symbol?: string;
  decimals?: number;
  onUpdateContext: (context: Context) => void;
  delegatedBalance: number;
}

interface Form {
  amount: number;
}

export const ActionPanel: FC<Props> = ({
  context,
  availableBalance,
  stakedBalance,
  symbol,
  onUpdateContext,
  delegatedBalance,
}) => {
  const { nearService } = useWalletContext();
  const { daoName, contractAddress, decimals } = useDelegatePageContext();
  const { triggerUpdate } = useTriggerUpdate();

  const maxValue =
    context === 'stake' ? availableBalance : stakedBalance - delegatedBalance;

  const schema = useMemo(() => {
    return yup.object().shape({
      amount: yup
        .number()
        .min(0)
        .max(+maxValue, 'Insufficient funds')
        .required(),
    });
  }, [maxValue]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const isValid = Object.keys(errors).length === 0;

  const onSubmit = async (data: Form) => {
    if (!nearService || !contractAddress) {
      return;
    }

    try {
      if (context === 'stake') {
        await nearService.stakeTokens({
          tokenContract: contractAddress,
          stakingContract: nearService.getStackingContract(daoName),
          amount: formatValueToYokto(data.amount, decimals ?? 0),
        });
      } else if (context === 'unstake') {
        await nearService.unstakeTokens({
          tokenContract: contractAddress,
          stakingContract: nearService.getStackingContract(daoName),
          amount: formatValueToYokto(data.amount, decimals ?? 0),
        });
      }

      await triggerUpdate();
    } catch (e) {
      console.error(e);
    }

    onUpdateContext(null);
  };

  function renderSubmitButton() {
    const content = (
      <Button
        capitalize
        type="submit"
        variant="primary"
        size="medium"
        className={cn(styles.controlButton, styles.primaryButton)}
        disabled={!isValid}
      >
        {context}
      </Button>
    );

    if (!isValid) {
      return (
        <Tooltip
          placement="top"
          className={styles.controlWrapper}
          overlay={<span>{errors?.amount?.message}</span>}
        >
          {content}
        </Tooltip>
      );
    }

    return <div className={styles.controlWrapper}>{content}</div>;
  }

  return (
    <form
      className={styles.actionsPanel}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.row}>
        <span className={styles.actionsContext}>{context}</span>
        <span className={styles.alignRight}>
          <span className={styles.label}>Available:</span>
          <span className={styles.value}>
            {maxValue} {symbol}
          </span>
        </span>
      </div>
      <div>
        <ControlledInput
          inputClassName={styles.input}
          maxValue={Number(maxValue)}
          symbol={symbol}
          onMaxPress={max => {
            setValue('amount', max, { shouldValidate: true });
          }}
          {...register('amount')}
        />
      </div>
      <div className={styles.footer}>
        {renderSubmitButton()}
        <div className={styles.controlWrapper}>
          <Button
            capitalize
            variant="tertiary"
            size="block"
            onClick={() => onUpdateContext(null)}
            className={styles.controlButton}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};
