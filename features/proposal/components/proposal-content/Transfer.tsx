import { FC, useMemo } from 'react';
import { useCustomTokensContext } from 'context/CustomTokensContext';
import { formatYoktoValue } from 'helpers/format';
import { Token } from 'features/types';

import styles from './proposal-content.module.scss';

interface TransferProps {
  amount: string;
  token: Token | string;
  recipient: string;
}

export const Transfer: FC<TransferProps> = ({ amount, token, recipient }) => {
  const { tokens } = useCustomTokensContext();

  const tokenData = useMemo(() => {
    const tokensData = Object.values(tokens).find(
      item => item.tokenId === token
    );
    const divider = tokensData?.decimals;
    const symbol = tokensData?.symbol ?? 'NEAR';
    const value = formatYoktoValue(amount, divider);

    return {
      value,
      symbol,
    };
  }, [amount, token, tokens]);

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.label}>Amount</div>
        <div>
          <span className={styles.amount}>{tokenData.value}</span>
          <span className={styles.symbol}>{tokenData.symbol}</span>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>Target</div>
        <div className={styles.recipient}>{recipient}</div>
      </div>
    </div>
  );
};
