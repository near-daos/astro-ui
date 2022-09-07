import cn from 'classnames';
import Image from 'next/image';
import { forwardRef } from 'react';

import styles from 'astro_2.0/components/SelectorIcons/SelectorIcons.module.scss';

interface NearIconProps {
  black?: boolean;
  className?: string;
  onClick?: () => void;
  showLoader?: boolean;
}

export const SelectorNearIcon = forwardRef<HTMLDivElement, NearIconProps>(
  (props, ref) => {
    const { black, className, onClick, showLoader } = props;

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
          src="/assets/img/mynearwallet.jpg"
          alt="My near wallet"
          className={styles.image}
          width={38}
          height={38}
        />
      </div>
    );
  }
);
