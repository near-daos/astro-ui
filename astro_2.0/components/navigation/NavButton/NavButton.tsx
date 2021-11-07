import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { useCallback, useState, VFC } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { NavItemProps } from 'astro_2.0/components/navigation/types';

import { useIsHrefActive } from 'hooks/useIsHrefActive';

import { Icon } from 'components/Icon';
import { Popup } from 'components/popup/Popup';

import styles from './NavButton.module.scss';

interface NavButtonProps extends NavItemProps {
  mobile?: boolean;
}

export const NavButton: VFC<NavButtonProps> = props => {
  const router = useRouter();

  const { login, accountId } = useAuthContext();

  const { label, icon, href, mobile, hoverIcon, authRequired } = props;

  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isActive = useIsHrefActive(href);

  const rootClassName = cn(styles.root, {
    [styles.active]: isActive,
    [styles.mobile]: mobile,
  });

  const onMouseOver = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  function navigate() {
    if (authRequired && !accountId) {
      login();

      return;
    }

    router.push(href);
  }

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={navigate}
      onKeyPress={navigate}
      onBlur={onMouseOut}
      onFocus={onMouseOver}
      onMouseOut={onMouseOut}
      className={rootClassName}
      onMouseOver={onMouseOver}
    >
      <div className={styles.description} ref={setRef}>
        <div className={styles.iconHolder}>
          <Icon
            height={16}
            className={styles.icon}
            name={isHovered || isActive ? hoverIcon : icon}
          />
        </div>
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.underline} />
      <Popup className={styles.tooltip} anchor={ref}>
        {label}
      </Popup>
    </div>
  );
};
