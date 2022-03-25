import React from 'react';
import cn from 'classnames';
import styles from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletDescription/WalletDescription.module.scss';

interface WalletItemProps {
  name: 'NEAR' | 'Sender';
  type: 'web' | 'extension';
  url: string;
  className?: string;
}

export const WalletDescription: React.FC<WalletItemProps> = ({
  name,
  type,
  url,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.column}>
        <div className={styles.row}>
          <div className={styles.boldText}>{name}&nbsp;</div>
          <div className={styles.greyText}>({type})</div>
        </div>
        <div className={styles.row}>
          <div className={styles.greyText}>{url}</div>
        </div>
      </div>
    </div>
  );
};
