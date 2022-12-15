import cn from 'classnames';
import Image from 'next/image';
import { forwardRef, useMemo } from 'react';

import styles from 'astro_2.0/components/SelectorIcons/SelectorIcons.module.scss';
import { useWalletContext } from 'context/WalletContext';

interface NearIconProps {
  black?: boolean;
  className?: string;
  onClick?: () => void;
  showLoader?: boolean;
}

export const SelectorNearIcon = forwardRef<HTMLDivElement, NearIconProps>(
  (props, ref) => {
    const { black, className, onClick, showLoader } = props;

    const { walletSelector, currentWallet } = useWalletContext();

    const imageUrl = useMemo(() => {
      if (!walletSelector) {
        return '/assets/img/mynearwallet.jpg';
      }

      const walletState = walletSelector?.store.getState();
      const selectedWalletModule = walletState?.modules.find(
        item =>
          item.id === walletState?.selectedWalletId || item.id === currentWallet
      );

      return (
        selectedWalletModule?.metadata.iconUrl ?? '/assets/img/mynearwallet.jpg'
      );
    }, [walletSelector, currentWallet]);

    const rootClassName = cn(styles.root, className, {
      [styles.black]: black,
      [styles.loading]: showLoader,
    });

    return (
      <div
        role="button"
        tabIndex={0}
        ref={ref}
        onKeyDown={onClick}
        onClick={onClick}
        className={rootClassName}
      >
        <Image
          src={imageUrl}
          alt="Selected wallet"
          className={styles.image}
          width={38}
          height={38}
        />
      </div>
    );
  }
);
