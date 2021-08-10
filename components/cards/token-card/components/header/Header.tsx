import React from 'react';
import classNames from 'classnames';
import styles from 'components/cards/token-card/token-card.module.scss';
import headerStyles from 'components/cards/token-card/components/header/header.module.scss';

export const Header: React.FC = () => {
  return (
    <div className={classNames(styles.container, headerStyles.root)}>
      <div className={headerStyles.caption}>Token</div>
      <div className={headerStyles.caption}>Balance</div>
      <div className={headerStyles.caption}>Value</div>
      <div className={headerStyles.caption}>Fraction</div>
    </div>
  );
};
