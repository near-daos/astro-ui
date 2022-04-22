import React, { FC, useState } from 'react';

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
  const [selected, setSelected] = useState<string>();
  const [contractAddress, setContractAddress] = useState<string>('');

  return (
    <div className={styles.root}>
      <h2>Choose existing token for using in voting</h2>

      <section>
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

      <div className={styles.divider} />

      <section>
        <div className={styles.inputWrapper}>
          <Icon name="buttonSearch" className={styles.iconSearch} />
          <Input
            isBorderless
            inputClassName={styles.input}
            size="block"
            placeholder="Provide contract address"
            onChange={e =>
              setContractAddress((e.target as HTMLInputElement).value)
            }
          />
        </div>

        <div className={styles.controls}>
          <Button
            className={styles.controlBtn}
            variant="secondary"
            size="medium"
            disabled={!contractAddress}
            onClick={async () => {
              await onUpdate({
                ...status,
                step: CreateGovernanceTokenSteps.ContractAcceptance,
                proposalId: null,
                contractAddress,
              });
            }}
          >
            Next step
          </Button>
        </div>
      </section>
    </div>
  );
};
