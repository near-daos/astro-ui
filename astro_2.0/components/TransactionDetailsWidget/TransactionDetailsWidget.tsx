import React from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { formatYoktoValue } from 'utils/format';
import { TgasInput } from 'astro_2.0/components/TgasInput';

import { Icon } from 'components/Icon';
import Tooltip from 'react-tooltip';

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
  bondInfo?: string;
}

export const TransactionDetailsWidget: React.FC<CreateProposalWidgetProps> = ({
  onSubmit,
  bond,
  gas,
  standAloneMode = false,
  buttonLabel = 'Purpose',
  warning,
  bondInfo,
}) => {
  const {
    handleSubmit,
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
    : {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={cn(styles.root, { [styles.wholeCard]: standAloneMode })}>
        {renderWarning()}
        <div className={styles.mainContent}>
          <div className={styles.transactionDetails}>
            <TgasInput {...gasInputProps} className={styles.tgasInput} />
            <InputWrapper
              className={styles.detailsItem}
              labelClassName={styles.inputLabel}
              fieldName="bond"
              label={
                bondInfo ? (
                  <span
                    data-tip={bondInfo}
                    data-place="top"
                    data-delay-show="700"
                  >
                    {t('components.transactionDetailsWidget.bond')}
                    <Icon name="info" width={12} className={styles.bondInfo} />
                  </span>
                ) : (
                  t('components.transactionDetailsWidget.bond')
                )
              }
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
            disabled={Object.keys(errors).length > 0}
            type="submit"
            size="medium"
            variant="black"
            className={styles.createButton}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
      <Tooltip effect="solid" />
    </form>
  );
};
