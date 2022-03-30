import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletIcon/WalletIcon';
import { WalletType } from 'types/config';
import { WalletDescription } from 'astro_2.0/components/AppHeader/components/AccountButton/components/WalletDescription';
import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountButton/components/AccountPopupItem';
import React from 'react';
import cn from 'classnames';
import styles from './WalletButton.module.scss';

interface WalletButton {
  walletType: WalletType;
  isSelected?: boolean;
  onClick: () => void;
  name: 'NEAR' | 'Sender';
  type: 'web' | 'extension';
  url: string;
  className?: string;
}

export const WalletButton: React.FC<WalletButton> = ({
  walletType,
  isSelected = false,
  onClick,
  name,
  type,
  url,
  className,
}) => {
  return (
    <AccountPopupItem
      icon={<WalletIcon walletType={walletType} isSelected={isSelected} />}
      content={<WalletDescription name={name} type={type} url={url} />}
      onClick={onClick}
      className={cn(styles.item, className)}
    />
  );
};
