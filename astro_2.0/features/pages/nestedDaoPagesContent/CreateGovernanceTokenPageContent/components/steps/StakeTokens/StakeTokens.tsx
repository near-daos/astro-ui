import React, { FC, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { AmountBalanceCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/AmountBalanceCard';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { useWalletContext } from 'context/WalletContext';
import { useAsync } from 'react-use';
import { formatYoktoValue } from 'utils/format';

import { CustomContract } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/types';

import styles from './StakeTokens.module.scss';

interface Props {
  onSubmit: () => void;
  daoName: string;
  contractAddress: string;
}

interface Form {
  stake: number;
}

export const StakeTokens: FC<Props> = ({
  onSubmit,
  contractAddress,
  daoName,
}) => {
  const { nearService, accountId } = useWalletContext();

  const [tokenDetails, setTokenDetails] = useState<{
    balance: number;
    symbol: string;
    decimals: number;
  } | null>(null);

  const { loading: loadingAmount } = useAsync(async () => {
    if (!nearService) {
      return;
    }

    const contract = nearService.getContract(contractAddress, [
      'ft_balance_of',
      'ft_metadata',
    ]) as CustomContract;

    const [meta, balance] = await Promise.all([
      contract.ft_metadata(),
      contract.ft_balance_of({ account_id: accountId }),
    ]);

    setTokenDetails({
      balance: Number(formatYoktoValue(balance, meta.decimals)),
      symbol: meta.symbol,
      decimals: meta.decimals,
    });
  }, [nearService, accountId, contractAddress]);

  const schema = useMemo(() => {
    return yup.object().shape({
      stake: yup
        .number()
        .positive()
        .max(tokenDetails?.balance ?? 0)
        .required(),
    });
  }, [tokenDetails]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const submitHandler = async (data: Form) => {
    if (!nearService) {
      return;
    }

    // do stake
    await nearService.stakeTokens({
      tokenContract: contractAddress,
      stakingContract: nearService.getStackingContract(daoName),
      amount: data.stake.toFixed(),
    });

    // toggle onsubmit
    onSubmit();
  };

  return (
    <form
      className={styles.root}
      noValidate
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Stake tokens</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.description}>
            Stake your voting tokens. You can delegate voting to other
            participants with these tokens
          </p>
          <AmountBalanceCard
            value={tokenDetails?.balance}
            suffix={tokenDetails?.symbol}
            loading={loadingAmount}
          />
        </div>
        <div className={styles.footer}>
          <span className={styles.inputLabel}>{tokenDetails?.symbol}</span>
          <Input
            isBorderless
            isValid={!errors.stake?.message}
            className={styles.input}
            size="small"
            textAlign="left"
            min={0}
            max={tokenDetails?.balance}
            type="number"
            placeholder={`${tokenDetails?.balance ?? 0}`}
            {...register('stake')}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <Button
          className={styles.controlBtn}
          type="submit"
          variant="black"
          disabled={!isValid}
        >
          Next step
        </Button>
      </div>
    </form>
  );
};
