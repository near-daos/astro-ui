// TODO requires localisation

import cn from 'classnames';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, useCallback, useRef, useState } from 'react';

import { InputFormWrapper } from 'components/inputs/InputFormWrapper';
import { TokenCard } from 'components/cards/TokenCard';
import { Button } from 'components/button/Button';
import { Input } from 'components/inputs/Input';

import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { sorter } from 'features/treasury/helpers';
import { formatCurrency } from 'utils/formatCurrency';

import {
  CreateGovernanceTokenFlow,
  CreateGovernanceTokenSteps,
  ProgressStatus,
} from 'types/settings';

import { SputnikNearService } from 'services/sputnik';

import { useWalletContext } from 'context/WalletContext';

import styles from './ChooseExistingToken.module.scss';

interface Props {
  onUpdate: ({
    step,
    proposalId,
    flow,
    contractAddress,
    selectedToken,
  }: {
    step: CreateGovernanceTokenSteps | null;
    proposalId: number | null;
    flow: CreateGovernanceTokenFlow;
    contractAddress?: string;
    selectedToken?: string;
  }) => Promise<void>;
  status: ProgressStatus;
}

async function validateTokenAccount(
  value: string | undefined,
  nearService: SputnikNearService | undefined | null
) {
  if (!value || !nearService) {
    return false;
  }

  try {
    const contractAddress = value.trim();

    const meta = await nearService.getFtMetadata(contractAddress);

    return !!meta;
  } catch (e) {
    return false;
  }
}

export const ChooseExistingToken: FC<Props> = ({ onUpdate, status }) => {
  const { tokens } = useDaoCustomTokens();
  const { nearService } = useWalletContext();
  const [selected, setSelected] = useState<string>();

  const errorEl = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ contractAddress: string }>({
    mode: 'onSubmit',
    resolver: yupResolver(
      yup.object().shape({
        contractAddress: yup
          .string()
          .test(
            'tokenExists',
            'You should use a valid token address',
            async address => {
              return validateTokenAccount(address, nearService || undefined);
            }
          ),
      })
    ),
  });

  const onSubmit = useCallback(
    async ({ contractAddress }) => {
      await onUpdate({
        ...status,
        step: CreateGovernanceTokenSteps.ContractAcceptance,
        proposalId: null,
        contractAddress: contractAddress.trim(),
      });
    },
    [status, onUpdate]
  );

  return (
    <div className={styles.root}>
      <h2>Contract address of your NEP-141 Fungible Token</h2>

      <p className={styles.subheader}>
        The address of your FT contract can be found by clicking on its name
        at&nbsp;
        <a
          href="https://tkn.farm/"
          rel="noreferrer"
          target="_blank"
          className={styles.link}
        >
          tkn.farm
        </a>{' '}
        or in your wallet.
      </p>

      <section className={styles.hidden}>
        <div className={styles.tokens}>
          {Object.values(tokens)
            .sort(sorter)
            .map(({ icon, symbol, balance, id, price }) => (
              <TokenCard
                key={`${id}-${symbol}`}
                isActive={selected === id}
                symbol={symbol}
                onClick={() => {
                  setSelected(id);
                }}
                icon={icon}
                balance={Number(balance)}
                totalValue={
                  price
                    ? formatCurrency(parseFloat(balance) * Number(price))
                    : null
                }
              />
            ))}
        </div>

        <div className={styles.controls}>
          <Button
            className={styles.controlBtn}
            variant="secondary"
            size="medium"
            disabled={!selected}
            onClick={async () => {
              await onUpdate({
                ...status,
                step: CreateGovernanceTokenSteps.ContractAcceptance,
                proposalId: null,
                selectedToken: selected,
              });
            }}
          >
            Next step
          </Button>
        </div>
      </section>

      <div className={cn(styles.divider, styles.hidden)} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className={styles.inputWrapper}>
            <InputFormWrapper
              errors={errors}
              errorElRef={errorEl}
              className={styles.fullWidth}
              component={
                <Input
                  isBorderless
                  inputClassName={styles.input}
                  size="block"
                  inputStyles={{ width: '100%' }}
                  placeholder="E.g. first.tkn.farm"
                  {...register('contractAddress')}
                />
              }
            />
          </div>
          <div ref={errorEl} />

          <div className={styles.controls}>
            <Button
              capitalize
              className={styles.controlBtn}
              variant="secondary"
              size="medium"
              type="submit"
            >
              Next step
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};
