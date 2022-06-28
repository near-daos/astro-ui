import React, { FC, useCallback, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAsync } from 'react-use';
import Decimal from 'decimal.js';

import { formatYoktoValue } from 'utils/format';
import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';
import { useWalletContext } from 'context/WalletContext';

import { AmountBalanceCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/AmountBalanceCard';
import { AccountAmount } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/DelegateVoting/AccountAmount';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import { CustomContract } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/types';
import { DAO } from 'types/dao';

import styles from './DelegateVoting.module.scss';

interface Props {
  onSubmit: () => void;
  dao: DAO;
  contractAddress: string;
}

type AccountAmountDetails = { name: string; amount: number };

type Form = { accounts: AccountAmountDetails[] };

// TODO requires localisation
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

    const ftContract = nearService.getContract(contractAddress, [
      'ft_balance_of',
      'ft_metadata',
    ]) as CustomContract;

    const stContract = nearService.getContract(
      nearService.getStackingContract(dao.name),
      ['ft_balance_of']
    ) as CustomContract;

    const [meta, balance] = await Promise.all([
      ftContract.ft_metadata(),
      stContract.ft_balance_of({ account_id: accountId }),
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
        .filter(group => group.slug === 'council')
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
    formState: { isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'accounts',
  });

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const submitHandler = async (data: Form) => {
    if (!nearService || !tokenDetails) {
      return;
    }

    // do delegate
    await nearService.delegateVoting(
      nearService.getStackingContract(dao.name),
      data.accounts.map(item => ({
        ...item,
        amount: new Decimal(item.amount)
          .mul(10 ** tokenDetails.decimals)
          .toFixed(),
      }))
    );

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
            <h2>Delegate Voting</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.rows}>
              {fields.map((item, index) => {
                return (
                  <AccountAmount
                    key={item.name}
                    item={item}
                    index={index}
                    onRemove={handleRemove}
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
            <AmountBalanceCard
              label="Stake Balance"
              value={tokenDetails?.balance}
              suffix={tokenDetails?.symbol}
              loading={loadingAmount}
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
            Finalize
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
