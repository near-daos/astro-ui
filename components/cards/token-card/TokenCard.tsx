import React from 'react';
import classNames from 'classnames';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value';
import { Icon } from 'components/Icon';
import { validUrlRegexp } from 'utils/regexp';
import styles from './token-card.module.scss';

export interface TokenCardProps {
  tokenId: string;
  icon: string;
  tokensBalance: number;
  totalValue: string | null;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  tokenId,
  icon,
  tokensBalance,
  totalValue
}) => {
  function getTokenIconName(iconName: string) {
    switch (iconName) {
      case 'near':
        return 'tokenNear';
      case 'meow':
        return 'socialSlack';
      default:
        return '';
    }
  }

  const tokenIconName = getTokenIconName(icon);

  const iconStyles = icon.match(validUrlRegexp)
    ? { backgroundImage: `url(${icon})` }
    : {
        background: 'var(--color-brand-black)',
        borderRadius: '50%'
      };

  return (
    <div className={classNames(styles.root, styles.grid)}>
      <div className={styles.iconContainer}>
        <div className={styles.iconWrapper}>
          {tokenIconName !== '' ? (
            <Icon name={tokenIconName} width={32} />
          ) : (
            <div className={styles.icon} style={iconStyles} />
          )}
        </div>
      </div>
      <div className={styles.tokenBalance}>
        {tokensBalance} <span className={styles.tokenName}>{tokenId}</span>
      </div>
      <div className={styles.totalValue}>
        {totalValue && (
          <FormattedNumericValue value={totalValue} suffix="usd" />
        )}
      </div>
    </div>
  );
};
