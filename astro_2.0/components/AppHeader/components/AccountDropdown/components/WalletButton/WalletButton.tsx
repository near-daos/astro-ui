import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon/WalletIcon';
import { WalletType } from 'types/config';
import { WalletDescription } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletDescription';
import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem';
import React from 'react';
import cn from 'classnames';
import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletButton/WalletButton.module.scss';

interface WalletButton {
  walletType: WalletType;
  isSelected?: boolean;
  onClick: () => void;
  name: string;
  type: string;
  url: string;
  className?: string;
  disabled?: boolean;
}

export const WalletButton: React.FC<WalletButton> = ({
  walletType,
  isSelected = false,
  onClick,
  name,
  type,
  url,
  className,
  disabled,
}) => {
  return (
    <AccountPopupItem
      icon={<WalletIcon walletType={walletType} isSelected={isSelected} />}
      content={<WalletDescription name={name} type={type} url={url} />}
      onClick={onClick}
      className={cn(styles.item, className, {
        [styles.disabled]: disabled,
      })}
    />
  );
};
