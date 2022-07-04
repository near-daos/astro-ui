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
import { Icon } from 'components/Icon';

import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { sorter } from 'features/treasury/helpers';
import { formatCurrency } from 'utils/formatCurrency';

import {
  CreateGovernanceTokenFlow,
  CreateGovernanceTokenSteps,
  ProgressStatus,
} from 'types/settings';

import { useWalletContext } from 'context/WalletContext';
import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';

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
              const exists = await validateUserAccount(
                address,
                nearService || undefined
              );

              return exists;
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
        contractAddress,
      });
    },
    [status, onUpdate]
  );

  return (
    <div className={styles.root}>
      <h2>Choose existing token for using in voting</h2>

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
            <Icon name="buttonSearch" className={styles.iconSearch} />
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
                  placeholder="Provide contract address"
                  {...register('contractAddress')}
                />
              }
            />
          </div>
          <div ref={errorEl} />

          <div className={styles.controls}>
            <Button
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
