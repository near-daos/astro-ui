import React from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';

import { formatYoktoValue } from 'helpers/format';

import styles from './TransactionDetailsWidget.module.scss';

interface InfoWidgetProps {
  label?: string;
  value: string;
}

interface CreateProposalWidgetProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
  bond: InfoWidgetProps;
  gas: InfoWidgetProps;
  warning?: string;
  buttonLabel?: string;
  standAloneMode?: boolean;
}

export const TransactionDetailsWidget: React.FC<CreateProposalWidgetProps> = ({
  onSubmit,
  bond,
  gas,
  standAloneMode = false,
  buttonLabel = 'Purpose',
  warning,
}) => {
  const { handleSubmit } = useFormContext();

  const infos = [
    {
      label: bond.label || 'Bond',
      value: formatYoktoValue(bond.value),
    },
    {
      label: gas.label || 'Gas',
      value: gas.value,
    },
  ];

  function renderWarning() {
    if (warning) {
      return (
        <InfoBlockWidget
          label="Warning"
          value={warning}
          className={styles.warningContainer}
          valueClassName={styles.warning}
        />
      );
    }

    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.root, { [styles.topBorder]: standAloneMode })}>
        {renderWarning()}
        <div className={styles.mainContent}>
          <div className={styles.transactionDetails}>
            {infos.map(info => (
              <InfoBlockWidget
                label={info.label}
                value={<InfoValue value={info.value} label="NEAR" />}
                key={info.label}
                className={styles.infoBlock}
              />
            ))}
          </div>
          <Button
            type="submit"
            size="medium"
            variant="black"
            className={styles.createDao}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
