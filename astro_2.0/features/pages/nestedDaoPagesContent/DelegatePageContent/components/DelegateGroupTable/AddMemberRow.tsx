import React, { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import * as yup from 'yup';

import { DebouncedInput } from 'components/inputs/Input';
import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';
import { useWalletContext } from 'context/WalletContext';

import { VotingPower } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/VotingPower';
import { Button } from 'components/button/Button';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { useDelegatePageContext } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageContext';

import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/DelegateGroupTable.module.scss';
import { useTriggerUpdate } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/hooks';
import { formatValueToYokto } from 'utils/format';

interface Props {
  symbol?: string;
  onAddMember: () => void;
  votingThreshold: string;
}

interface Form {
  account: string;
  amount: number;
}

export const AddMemberRow: FC<Props> = ({ votingThreshold, onAddMember }) => {
  const { nearService } = useWalletContext();

  const { daoName, stakedBalance, delegatedBalance, decimals } =
    useDelegatePageContext();
  const { triggerUpdate } = useTriggerUpdate();

  const maxValue = Number(stakedBalance) - Number(delegatedBalance);

  const schema = useMemo(() => {
    return yup.object().shape({
      account: yup
        .string()
        .test({
          name: 'notValidNearAccount',
          exclusive: true,
          message: 'Only valid near accounts are allowed',
          test: async value => validateUserAccount(value, nearService),
        })
        .required('Required'),
      amount: yup
        .number()
        .min(0, 'Amount must be a positive number.')
        .max(maxValue, `Insufficient funds. Max: ${maxValue}`)
        .typeError('Amount must be a valid number.'),
    });
  }, [maxValue, nearService]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const currentAmount = watch('amount') ?? 0;

  const progressPercent = (+currentAmount * 100) / +votingThreshold;

  const onSubmit = async (values: Form) => {
    if (!nearService) {
      return;
    }

    await nearService.delegateVoting(nearService.getStackingContract(daoName), [
      {
        name: values.account,
        amount: formatValueToYokto(values.amount, decimals ?? 0),
      },
    ]);

    await triggerUpdate();

    onAddMember();
  };

  function renderAccountInput() {
    const content = (
      <DebouncedInput
        isBorderless
        inputClassName={cn(styles.input, {
          [styles.error]: !!errors?.account,
        })}
        placeholder=""
        {...register('account')}
        onValueChange={val => {
          setValue(`account`, val as string, {
            shouldValidate: true,
          });
        }}
        size="block"
      />
    );

    if (errors.account) {
      return (
        <Tooltip
          placement="top"
          overlay={
            <span>
              {errors.account ? errors.account.message : 'Account ID'}
            </span>
          }
        >
          {content}
        </Tooltip>
      );
    }

    return content;
  }

  function renderAmountInput() {
    const content = (
      <DebouncedInput
        isBorderless
        inputClassName={cn(styles.input, {
          [styles.error]: !!errors?.amount,
        })}
        placeholder=""
        {...register('amount')}
        type="number"
        min={0}
        max={maxValue}
        onValueChange={val => {
          setValue(`amount`, val as number, {
            shouldValidate: true,
          });
        }}
        size="block"
      />
    );

    if (errors.amount) {
      return (
        <Tooltip
          placement="top"
          overlay={
            <span>{errors.amount ? errors.amount.message : 'Amount'}</span>
          }
        >
          {content}
        </Tooltip>
      );
    }

    return content;
  }

  return (
    <form className={styles.row} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>{renderAccountInput()}</div>
      <div>{renderAmountInput()}</div>
      <div className={styles.desktop}>
        <VotingPower
          progressPercent={progressPercent}
          inactiveVotingPower={false}
        />
      </div>
      <div className={styles.inline}>
        <Button
          variant="transparent"
          size="small"
          capitalize
          type="submit"
          className={styles.controlButton}
        >
          Save
        </Button>
        <Button
          variant="transparent"
          size="small"
          capitalize
          className={styles.controlButton}
          onClick={onAddMember}
        >
          Dismiss
        </Button>
      </div>
    </form>
  );
};
