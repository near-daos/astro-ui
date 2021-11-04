import React from 'react';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';

import { formatYoktoValue } from 'helpers/format';

import styles from './TransactionDetailsWidget.module.scss';

interface CreateProposalWidgetProps {
  onCreate: () => void;
  bond: string;
  gas: string;
  transaction?: string;
  buttonLabel?: string;
  standAloneMode?: boolean;
}

export const TransactionDetailsWidget: React.FC<CreateProposalWidgetProps> = ({
  onCreate,
  bond,
  gas,
  standAloneMode = false,
  buttonLabel = 'Purpose',
  transaction,
}) => {
  const infos = [
    { label: 'Bond', value: formatYoktoValue(bond) },
    { label: 'Gas', value: gas },
  ];

  return (
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
      <Button variant="black" size="medium" onClick={onCreate} type="submit">
        {buttonLabel}
      </Button>
    </div>
  );
};
