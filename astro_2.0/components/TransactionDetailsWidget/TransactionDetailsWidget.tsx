import React from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';

import { formatYoktoValue } from 'helpers/format';

import styles from './TransactionDetailsWidget.module.scss';

interface CreateProposalWidgetProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
  bond: string;
  gas: string;
  transaction?: string;
  buttonLabel?: string;
  standAloneMode?: boolean;
}

export const TransactionDetailsWidget: React.FC<CreateProposalWidgetProps> = ({
  onSubmit,
  bond,
  gas,
  standAloneMode = false,
  buttonLabel = 'Purpose',
  transaction,
}) => {
  const { handleSubmit } = useFormContext();

  const infos = [
    { label: 'Bond', value: formatYoktoValue(bond) },
    { label: 'Gas', value: gas },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.root, { [styles.topBorder]: standAloneMode })}>
        {transaction && (
          <InfoBlockWidget
            label="Transaction"
            value={transaction}
            className={styles.left}
          />
        )}
        <div className={styles.transactionDetails}>
          {infos.map(info => (
            <InfoBlockWidget
              label={info.label}
              value={<InfoValue value={info.value} label="NEAR" />}
              key={info.label}
              className={styles.right}
            />
          ))}
        </div>
        <Button variant="black" size="medium" type="submit">
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
};
