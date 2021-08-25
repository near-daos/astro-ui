import Link from 'next/link';
import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value';
import { Icon } from 'components/Icon';
import styles from './token-card.module.scss';

export interface TokenCardProps {
  id: string;
  tokenName: TokenName;
  tokensBalance: number;
  totalValue: number;
  voteWeight: number;
  href: string;
}

export enum TokenName {
  NEAR = 'NEAR'
}

export const TokenCard: React.FC<TokenCardProps> = ({
  tokenName,
  tokensBalance,
  totalValue,
  voteWeight,
  href
}) => {
  return (
    <Link href={href} passHref>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>
        <div className={classNames(styles.root, styles.grid)}>
          <div className={styles.tokenContainer}>
            <div className={styles.icon}>
              <Icon name="iconNear" />
            </div>
            <div className={classNames('subtitle3', styles.name)}>
              {tokenName}
            </div>
          </div>
          <div className={styles.tokensBalance}>{tokensBalance}</div>
          <FormattedNumericValue
            value={totalValue}
            suffix="usd"
            className={styles.totalValue}
          />
          <div className={styles.fraction}>
            <div className={styles.fractionTotal}>
              <div
                className={styles.fractionCurrent}
                style={
                  { '--currentWeight': `${voteWeight}px` } as CSSProperties
                }
              />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};
