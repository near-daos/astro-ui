import React, { FC } from 'react';
import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { formatYoktoValue } from 'helpers/format';
import { useIsValidImage } from 'hooks/useIsValidImage';

import styles from './TransferContent.module.scss';

interface TransferContentProps {
  amount: string;
  target: string;
  token: string;
}

export const TransferContent: FC<TransferContentProps> = ({
  amount,
  target,
  token,
}) => {
  const { tokens } = useCustomTokensContext();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  const isValid = useIsValidImage(tokenData?.icon);

  function renderIcon() {
    if (tokenData?.symbol === 'NEAR') {
      return <Icon name="tokenNearBig" />;
    }

    if (isValid) {
      return (
        <div
          style={{
            backgroundImage: `url(${tokenData.icon})`,
          }}
          className={styles.icon}
        />
      );
    }

    return <div className={styles.icon} />;
  }

  return (
    <div className={styles.root}>
      <FieldWrapper label="Amount">
        {tokenData ? (
          <FieldValue
            value={formatYoktoValue(amount, tokenData.decimals)}
            noWrap
          />
        ) : (
          <div className={styles.loaderWrapper}>
            <LoadingIndicator />
          </div>
        )}
      </FieldWrapper>
      <FieldWrapper label="">
        <div className={styles.row}>
          {tokenData && (
            <>
              <div className={styles.iconWrapper}>{renderIcon()}</div>
              <div className={styles.symbol}>{tokenData.symbol}</div>
            </>
          )}
        </div>
      </FieldWrapper>
      <FieldWrapper label="Target">
        <FieldValue value={target} />
      </FieldWrapper>
    </div>
  );
};
