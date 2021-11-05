import React from 'react';
import classNames from 'classnames';
import styles from 'components/cards/token-card/token-card.module.scss';
import headerStyles from 'components/cards/token-card/components/header/header.module.scss';

const HEADERS = ['Token', 'Balance', 'Value', 'Fraction'];

export const Header: React.FC = () => {
  return (
    <div className={classNames(styles.grid, headerStyles.root)}>
      {HEADERS.map(header => (
        <div className={headerStyles.caption} key={header}>
          {header}
        </div>
      ))}
    </div>
  );
};
