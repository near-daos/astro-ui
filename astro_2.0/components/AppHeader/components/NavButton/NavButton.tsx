import cn from 'classnames';
import Link from 'next/link';
import React, { FC, useCallback, useState } from 'react';

import { useIsHrefActive } from 'hooks/useIsHrefActive';

import { Popup } from 'components/popup/Popup';
import { Icon, IconName } from 'components/Icon';

import styles from './NavButton.module.scss';

interface NavButtonProps {
  href: string;
  icon: IconName;
  hoverIcon: IconName;
}

export const NavButton: FC<NavButtonProps> = ({
  icon,
  href,
  children,
  hoverIcon,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isActive = useIsHrefActive(href);

  const rootClassName = cn(styles.root, {
    [styles.active]: isActive,
  });

  const onMouseOver = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <Link href={href} passHref>
      <div
        className={rootClassName}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onFocus={onMouseOver}
        onBlur={onMouseOut}
      >
        <div className={styles.description} ref={setRef}>
          <div className={styles.iconHolder}>
            <Icon
              height={16}
              className={styles.icon}
              name={isHovered || isActive ? hoverIcon : icon}
            />
          </div>
          <div className={styles.label}>{children}</div>
        </div>
        <div className={styles.underline} />
        <Popup className={styles.tooltip} anchor={ref}>
          {children}
        </Popup>
      </div>
    </Link>
  );
};
