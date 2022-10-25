import React, { FC, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { AmountBalanceCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/AmountBalanceCard';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { useWalletContext } from 'context/WalletContext';
import { useAsync } from 'react-use';
import cn from 'classnames';
import { formatValueToYokto, formatYoktoValue } from 'utils/format';

import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import { getInputWidth } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers';

import { STAKE_TOKENS_KEY } from 'constants/localStorage';

import styles from './StakeTokens.module.scss';

interface Props {
  onSubmit: () => void;
  daoName: string;
  contractAddress: string;
  daoId: string;
}

interface Form {
  stake: number;
}

export const StakeTokens: FC<Props> = ({
  onSubmit,
  contractAddress,
  daoName,
  daoId,
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

    const [meta, balance] = await Promise.all([
      nearService.getFtMetadata(contractAddress),
      nearService.getFtBalance(contractAddress, accountId),
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

  const methods = useForm<Form>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = methods;

  const stake = watch('stake');

  const submitHandler = async (data: Form) => {
    if (!nearService || !tokenDetails) {
      return;
    }

    localStorage.setItem(STAKE_TOKENS_KEY, daoId);

    // do stake
    await nearService.stakeTokens({
      tokenContract: contractAddress,
      stakingContract: nearService.getStackingContract(daoName),
      amount: formatValueToYokto(data.stake, tokenDetails.decimals),
    });

    // toggle onsubmit
    onSubmit();
  };

  return (
    <FormProvider {...methods}>
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
              For every token you stake you will receive voting power, which you
              can delegate to yourself or others.
            </p>
            <AmountBalanceCard
              value={tokenDetails?.balance}
              suffix={tokenDetails?.symbol}
              loading={loadingAmount}
            />
          </div>
          <div className={styles.footer}>
            <div className={styles.row}>
              <InputWrapper
                fieldName="stake"
                label="Stake"
                className={cn(styles.detailsItem)}
                labelClassName={cn(styles.inputLabel)}
              >
                <div className={styles.input}>
                  <Input
                    className={cn(styles.inputWrapper, styles.detailsInput)}
                    placeholder={`${tokenDetails?.balance ?? 0}`}
                    isBorderless
                    size="auto"
                    inputStyles={{
                      padding: '10.5px 0',
                      width: getInputWidth(`${stake}`, 30, 12),
                    }}
                    {...register('stake')}
                  />
                </div>
              </InputWrapper>
              <span className={styles.suffix}>{tokenDetails?.symbol}</span>
            </div>
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
    </FormProvider>
  );
};
