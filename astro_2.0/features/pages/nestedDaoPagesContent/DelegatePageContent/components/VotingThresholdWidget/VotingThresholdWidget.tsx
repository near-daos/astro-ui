import React, { FC } from 'react';
import ContentLoader from 'react-content-loader';

import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { kFormatter } from 'utils/format';
import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';

import cn from 'classnames';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/DelegatePageContent.module.scss';

interface Props {
  loading: boolean;
  value: number;
  suffix?: string;
  onEdit: () => void;
  disabled: boolean;
  showGoalChart: boolean;
  onToggleChart: () => void;
}

export const VotingThresholdWidget: FC<Props> = ({
  loading,
  value,
  suffix,
  onEdit,
  disabled,
  showGoalChart,
  onToggleChart,
}) => {
  return (
    <DelegatePageWidget
      titleIcon="goal"
      className={cn(styles.expandableWidget, {
        [styles.expanded]: showGoalChart,
      })}
      title="Amount tokens to accept proposal"
    >
      {loading ? (
        <ContentLoader height={28} width={80}>
          <rect x="0" y="0" width="80" height="28" />
        </ContentLoader>
      ) : (
        <div className={styles.depositWidget}>
          <FormattedNumericValue
            value={kFormatter(value)}
            suffix={suffix}
            valueClassName={styles.primaryValue}
            suffixClassName={styles.secondaryValue}
          />
        </div>
      )}
      <Button
        size="block"
        variant="transparent"
        disabled={disabled}
        className={cn(styles.editButtonWrapper, {
          [styles.visible]: showGoalChart,
        })}
        onClick={onEdit}
      >
        <div className={styles.editButton}>
          <Icon name="buttonEdit" className={styles.toggleIcon} width={16} />
        </div>
      </Button>
      <Button
        size="block"
        variant="transparent"
        className={styles.chartToggle}
        onClick={onToggleChart}
      >
        <Icon
          name={showGoalChart ? 'close' : 'info'}
          className={styles.toggleIcon}
          width={showGoalChart ? 12 : 16}
        />
      </Button>
    </DelegatePageWidget>
  );
};
