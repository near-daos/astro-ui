import { WalletType } from 'types/config';
import React from 'react';
import { NearIcon } from 'astro_2.0/components/NearIcon';
import { SenderIcon } from 'astro_2.0/components/SenderIcon';
import styles from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/WalletIcon/WalletIcon.module.scss';
import { SelectorNearIcon } from 'astro_2.0/components/SelectorIcons';

interface WalletIconProps {
  walletType: WalletType;
  isSelected: boolean;
  showLoader?: boolean;
}

export const WalletIcon: React.FC<WalletIconProps> = ({
  walletType,
  isSelected,
  showLoader,
}) => {
  const renderIcon = (icon: React.ReactElement) => {
    return (
      <div className={styles.iconContainer}>
        {icon}
        {isSelected && <div className={styles.selectedWallet} />}
      </div>
    );
  };

  switch (walletType) {
    case WalletType.SELECTOR_SENDER: {
      return renderIcon(<SenderIcon showLoader={showLoader} />);
    }
    case WalletType.SELECTOR_NEAR: {
      return renderIcon(<NearIcon showLoader={showLoader} />);
    }
    case WalletType.SELECTOR_MY_NEAR:
    default:
      return renderIcon(<SelectorNearIcon showLoader={showLoader} />);
  }
};
