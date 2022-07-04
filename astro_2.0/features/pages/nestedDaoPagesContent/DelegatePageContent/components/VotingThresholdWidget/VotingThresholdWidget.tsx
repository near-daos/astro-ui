import React, { FC } from 'react';
import ContentLoader from 'react-content-loader';

import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';
import { kFormatter } from 'utils/format';
import { IconButton } from 'components/button/IconButton';
import { DelegatePageWidget } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageWidget';

import styles from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/DelegatePageContent.module.scss';
import { Tooltip } from 'astro_2.0/components/Tooltip';

interface Props {
  loading: boolean;
  value: number;
  suffix?: string;
  onEdit: () => void;
}

export const VotingThresholdWidget: FC<Props> = ({
  loading,
  value,
  suffix,
  onEdit,
}) => {
  return (
    <DelegatePageWidget
      title="Voting Threshold"
      info="Required number of tokens to complete the voting"
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

          <span className={styles.alignRight}>
            <Tooltip overlay={<span>Change</span>} placement="top">
              <IconButton
                iconProps={{ width: 16 }}
                icon="buttonEdit"
                className={styles.widgetButton}
                onClick={onEdit}
              />
            </Tooltip>
          </span>
        </div>
      )}
    </DelegatePageWidget>
  );
};
