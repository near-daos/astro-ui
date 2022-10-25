import React, { FC, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAsync } from 'react-use';

import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';
import { useWalletContext } from 'context/WalletContext';

import { AmountBalanceCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/AmountBalanceCard';
import { AccountAmount } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/DelegateVoting/AccountAmount';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import { DAO } from 'types/dao';

import { formatValueToYokto, formatYoktoValue } from 'utils/format';

import { DELEGATE_VOTING_KEY } from 'constants/localStorage';

import styles from './DelegateVoting.module.scss';

interface Props {
  onSubmit: (opts: { symbol?: string; decimals?: number }) => void;
  dao: DAO;
  contractAddress: string;
}

type AccountAmountDetails = { name: string; amount: number };

type Form = { accounts: AccountAmountDetails[] };

export const DelegateVoting: FC<Props> = ({
  dao,
  onSubmit,
  contractAddress,
}) => {
  const { accountId, nearService } = useWalletContext();

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
      nearService.getFtBalance(
        nearService.getStackingContract(dao.name),
        accountId
      ),
    ]);

    setTokenDetails({
      balance: Number(formatYoktoValue(balance, meta.decimals)),
      symbol: meta.symbol,
      decimals: meta.decimals,
    });
  }, [nearService, accountId, dao]);

  const methods = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      accounts: dao.groups
        .filter(group => group.slug?.toLowerCase() === 'council')
        .reduce<AccountAmountDetails[]>((res, group) => {
          const members = group.members.map(member => ({
            name: member,
            amount: 0,
          }));

          res.push(...members);

          return res;
        }, []),
    },
    resolver: yupResolver(
      yup.object().shape({
        accounts: yup.array().of(
          yup.object().shape({
            name: yup
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
              .typeError('Amount must be a valid number.'),
          })
        ),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'accounts',
  });

  const accounts = watch('accounts');
  const total = accounts.reduce((res, item) => {
    return res + +item.amount;
  }, 0);
  const isValidDelegatedAmount = tokenDetails && total <= tokenDetails?.balance;

  const submitHandler = async (data: Form) => {
    if (!nearService || !tokenDetails) {
      return;
    }

    localStorage.setItem(DELEGATE_VOTING_KEY, dao.id);

    // do delegate
    await nearService.delegateVoting(
      nearService.getStackingContract(dao.name),
      data.accounts.map(item => ({
        ...item,
        amount: formatValueToYokto(item.amount, tokenDetails.decimals),
      }))
    );

    // toggle onsubmit
    onSubmit({
      symbol: tokenDetails?.symbol,
      decimals: tokenDetails?.decimals,
    });
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
            <h2>Delegate Voting Power</h2>

            <p>
              Your Stake Balance is your voting power. You can delegate that
              power to yourself or others.
            </p>
          </div>
          <div className={styles.body}>
            <div className={styles.rows}>
              {fields.map((item, index) => {
                return (
                  <AccountAmount
                    key={item.name}
                    item={item}
                    index={index}
                    onRemove={() => remove(index)}
                  />
                );
              })}
              <Button
                className={styles.rowWrapper}
                onClick={() => append({ name: '', amount: 0 })}
                variant="transparent"
                size="small"
              >
                <div className={styles.row}>
                  <div className={styles.accountPlaceholder} />
                  <div className={styles.amountPlaceholder} />
                  <Icon className={styles.addBtn} name="buttonAdd" width={24} />
                </div>
              </Button>
            </div>
            <div>
              <AmountBalanceCard
                label="Stake Balance"
                value={tokenDetails?.balance}
                suffix={tokenDetails?.symbol}
                loading={loadingAmount}
              />
              {!isValidDelegatedAmount && !!tokenDetails?.balance && (
                <div className={styles.globalError}>
                  <Icon name="alertTriangle" className={styles.errorIcon} />
                  Total delegated amount cannot exceed staked balance
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.controls}>
          <Button
            className={styles.controlBtn}
            type="submit"
            variant="black"
            disabled={!isValid || !isValidDelegatedAmount}
          >
            Finalize
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
