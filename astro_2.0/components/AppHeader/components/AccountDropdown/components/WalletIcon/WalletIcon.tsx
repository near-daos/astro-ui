import React from 'react';

import { WalletType } from 'types/config';

import { Button } from 'components/button/Button';
import { NearIcon } from 'astro_2.0/components/NearIcon';
import { SenderIcon } from 'astro_2.0/components/SenderIcon';

import styles from './WalletIcon.module.scss';

interface WalletIconProps {
  walletType: WalletType;
  isSelected: boolean;
  onClick?: () => void;
  showLoader?: boolean;
}

export const WalletIcon: React.FC<WalletIconProps> = ({
  walletType,
  isSelected,
  onClick,
  showLoader,
}) => {
  const renderIcon = (icon: React.ReactElement) => {
    return (
      <Button
        variant="transparent"
        size="block"
        disabled={showLoader}
        className={styles.iconContainer}
        onClick={onClick}
      >
        {icon}
        {isSelected && <div className={styles.selectedWallet} />}
      </Button>
    );
  };

  switch (walletType) {
    case WalletType.NEAR: {
      return renderIcon(<NearIcon showLoader={showLoader} />);
    }
    case WalletType.SENDER: {
      return renderIcon(<SenderIcon showLoader={showLoader} />);
    }
    default:
      return renderIcon(<NearIcon />);
  }
};
