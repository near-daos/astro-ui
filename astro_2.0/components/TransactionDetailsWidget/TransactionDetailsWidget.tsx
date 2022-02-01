import React from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { formatYoktoValue } from 'utils/format';
import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';

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
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  function renderWarning() {
    if (warning) {
      return (
        <InfoBlockWidget
          label={t('components.transactionDetailsWidget.warning')}
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

  const currentGasValue = watch('gas');

  function getInputWidth() {
    if (currentGasValue?.length > 6 && currentGasValue?.length <= 10) {
      return `${currentGasValue?.length}ch`;
    }

    if (currentGasValue?.length > 10) {
      return '10ch';
    }

    return '6ch';
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.root, { [styles.wholeCard]: standAloneMode })}>
        {renderWarning()}
        <div className={styles.mainContent}>
          <div className={styles.transactionDetails}>
            <InputWrapper
              className={styles.detailsItem}
              labelClassName={styles.inputLabel}
              fieldName="gas"
              label={t('components.transactionDetailsWidget.tGas')}
            >
              <div className={styles.row}>
                <Input
                  className={cn(styles.inputWrapper, styles.detailsInput, {
                    [styles.readOnly]: gas,
                    [styles.error]: errors?.gas,
                  })}
                  inputStyles={{
                    width: getInputWidth(),
                  }}
                  type="number"
                  min={MIN_GAS}
                  step={1}
                  max={MAX_GAS}
                  isBorderless
                  size="block"
                  {...gasInputProps}
                />
              </div>
            </InputWrapper>

            <InputWrapper
              className={styles.detailsItem}
              labelClassName={styles.inputLabel}
              fieldName="bond"
              label={t('components.transactionDetailsWidget.bond')}
            >
              <div className={styles.row}>
                <Input
                  className={cn(
                    styles.inputWrapper,
                    styles.detailsInput,
                    styles.readOnly
                  )}
                  readOnly
                  inputStyles={{
                    width: '5ch',
                  }}
                  type="number"
                  min={0.01}
                  step={0.01}
                  max={0.25}
                  placeholder="0.25"
                  defaultValue={formatYoktoValue(bond.value)}
                  isBorderless
                  size="content"
                />
                <div className={styles.tokenLabel}>NEAR</div>
              </div>
            </InputWrapper>
          </div>
          <Button
            type="submit"
            size="medium"
            variant="black"
            className={styles.createButton}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
