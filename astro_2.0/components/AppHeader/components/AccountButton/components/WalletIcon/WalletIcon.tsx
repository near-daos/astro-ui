import { WalletType } from 'types/config';
import React from 'react';
import { NearIcon } from 'astro_2.0/components/NearIcon';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import styles from './WalletIcon.module.scss';

interface WalletIconProps {
  walletType: WalletType;
  isSelected: boolean;
  onClick?: () => void;
}

export const WalletIcon: React.FC<WalletIconProps> = ({
  walletType,
  isSelected,
  onClick,
}) => {
  const renderIcon = (icon: React.ReactElement) => {
    return (
      <Button
        variant="transparent"
        size="block"
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
      return renderIcon(<NearIcon />);
    }
    case WalletType.SENDER: {
      return renderIcon(<Icon name="senderWallet" />);
    }
    default:
      return renderIcon(<NearIcon />);
  }
};
