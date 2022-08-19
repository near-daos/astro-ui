import React, { FC, useMemo } from 'react';
import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/DelegateGroupTable.module.scss';
import { formatValueToYokto, kFormatter } from 'utils/format';
import { ControlledInput } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/ControlledInput';
import { Button } from 'components/button/Button';
import { useForm } from 'react-hook-form';
import { useWalletContext } from 'context/WalletContext';
import { useDelegatePageContext } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageContext';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import cn from 'classnames';
import { useTriggerUpdate } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';
import { useTranslation } from 'next-i18next';

interface Props {
  accountId: string;
  actionContext?: 'Delegate' | 'Undelegate';
  onActionClick: (actionType: string | null) => void;
  availableBalance: number;
  symbol?: string;
  decimals?: number;
}

interface Form {
  amount: number;
}

export const ActionsRow: FC<Props> = ({
  accountId,
  actionContext,
  symbol,
  onActionClick,
}) => {
  const { t } = useTranslation();
  const { nearService } = useWalletContext();
  const { triggerUpdate } = useTriggerUpdate();

  const { daoName, stakedBalance, delegatedBalance, delegateToUser, decimals } =
    useDelegatePageContext();

  const delegatedAmount = (delegateToUser && delegateToUser[accountId]) || 0;

  const maxValue =
    actionContext === 'Delegate'
      ? Number(stakedBalance) - Number(delegatedBalance)
      : delegatedAmount;

  const maxValueFormatted = kFormatter(+maxValue);

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

  const onSubmit = async (values: Form) => {
    if (!nearService) {
      return;
    }

    try {
      if (actionContext === 'Delegate') {
        await nearService.delegateVoting(
          nearService.getStackingContract(daoName),
          [
            {
              name: accountId,
              amount: formatValueToYokto(values.amount, decimals ?? 0),
            },
          ]
        );
      } else if (actionContext === 'Undelegate') {
        await nearService.undelegateVoting(
          nearService.getStackingContract(daoName),
          [
            {
              name: accountId,
              amount: formatValueToYokto(values.amount, decimals ?? 0),
            },
          ]
        );
      }

      await triggerUpdate();
    } catch (e) {
      console.error(e);
    }

    onActionClick(null);
  };

  function renderSubmitButton() {
    const content = (
      <Button size="small" capitalize type="submit" disabled={!isValid}>
        {actionContext === 'Undelegate'
          ? t('delegateVoting.retract')
          : t('delegateVoting.delegate')}
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
      className={styles.actionsRow}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.desktop}>
        {actionContext === 'Undelegate'
          ? t('delegateVoting.retract')
          : t('delegateVoting.delegate')}
      </div>
      <div className={styles.desktop}>
        <span
          className={cn(styles.label, {
            [styles.error]: !isValid,
          })}
        >
          Available:
        </span>
        <span
          className={cn(styles.value, {
            [styles.error]: !isValid,
          })}
        >
          {maxValueFormatted} {symbol}
        </span>
      </div>
      <div>
        <ControlledInput
          symbol={symbol}
          maxValue={+maxValue}
          onMaxPress={max => {
            setValue('amount', max, { shouldValidate: true });
          }}
          {...register('amount')}
        />
      </div>
      {renderSubmitButton()}
    </form>
  );
};
