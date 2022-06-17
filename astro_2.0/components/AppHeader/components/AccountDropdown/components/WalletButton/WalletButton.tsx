import { WalletType } from 'types/config';
import React from 'react';
import cn from 'classnames';
import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem';
import { WalletIcon } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon';
import { WalletDescription } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletDescription';
import styles from './WalletButton.module.scss';

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
      onClick={onClick}
      classes={{
        root: cn(styles.item, className, {
          [styles.disabled]: disabled,
        }),
      }}
    >
      <WalletDescription name={name} type={type} url={url} />
    </AccountPopupItem>
  );
};
