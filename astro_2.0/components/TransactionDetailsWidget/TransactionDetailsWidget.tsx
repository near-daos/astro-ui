import React from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Input } from 'components/inputs/input/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { formatYoktoValue } from 'helpers/format';
import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';

import styles from './TransactionDetailsWidget.module.scss';

interface InfoWidgetProps {
  label?: string;
  value: string;
}

interface CreateProposalWidgetProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
  bond: InfoWidgetProps;
  gas?: InfoWidgetProps;
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
  const { handleSubmit, register } = useFormContext();

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

  const gasInputProps = gas
    ? {
        readOnly: true,
        defaultValue: gas.value,
      }
    : {
        placeholder: `${DEFAULT_PROPOSAL_GAS}`,
        ...register('gas'),
      };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.root, { [styles.topBorder]: standAloneMode })}>
        {renderWarning()}
        <div className={styles.mainContent}>
          <div className={styles.transactionDetails}>
            <InputWrapper fieldName="gas" label="Gas">
              <div className={styles.row}>
                <Input
                  className={cn(styles.inputWrapper, styles.narrow)}
                  type="number"
                  min={0.01}
                  step={0.01}
                  max={0.25}
                  isBorderless
                  size="block"
                  {...gasInputProps}
                />
                <div>NEAR</div>
              </div>
            </InputWrapper>

            <InputWrapper fieldName="bond" label="Bond">
              <div className={styles.row}>
                <Input
                  className={cn(styles.inputWrapper, styles.narrow)}
                  readOnly
                  type="number"
                  min={0.01}
                  step={0.01}
                  max={0.25}
                  placeholder="0.25"
                  defaultValue={formatYoktoValue(bond.value)}
                  isBorderless
                  size="block"
                />
                <div>NEAR</div>
              </div>
            </InputWrapper>
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
