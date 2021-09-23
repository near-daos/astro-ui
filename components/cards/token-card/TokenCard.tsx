import Link from 'next/link';
import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value';
import { Icon } from 'components/Icon';
import styles from './token-card.module.scss';

export interface TokenCardProps {
  id: string;
  icon: string;
  tokenName: string;
  tokensBalance: number;
  totalValue: string | null;
  voteWeight: number;
  href: string | null;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  icon,
  tokenName,
  tokensBalance,
  totalValue,
  voteWeight,
  href
}) => {
  const iconStyles = icon
    ? { backgroundImage: `url(${icon})` }
    : {
        background: 'var(--color-brand-neon-yellow)',
        borderRadius: '50%',
        overflow: 'hidden'
      };

  const content = (
    <div className={classNames(styles.root, styles.grid)}>
      <div className={styles.tokenContainer}>
        <div className={styles.iconWrapper}>
          {tokenName === 'near' ? (
            <Icon name="iconNear" />
          ) : (
            <div className={styles.icon} style={iconStyles} />
          )}
        </div>
        <div className={classNames('subtitle3', styles.name)}>{tokenName}</div>
      </div>
      <div className={styles.tokensBalance}>{tokensBalance}</div>
      {totalValue ? (
        <FormattedNumericValue
          value={totalValue}
          suffix="usd"
          className={styles.totalValue}
        />
      ) : (
        '-'
      )}
      <div className={styles.fraction}>
        <div className={styles.fractionTotal}>
          <div
            className={styles.fractionCurrent}
            style={{ '--currentWeight': `${voteWeight}px` } as CSSProperties}
          />
        </div>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} passHref>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>{content}</a>
    </Link>
  );
};
