import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { useCallback, useState, VFC } from 'react';

import { useAuthContext } from 'context/AuthContext';

import { DotsLoader } from 'astro_2.0/components/DotsLoader';
import { NavItemProps } from 'astro_2.0/components/navigation/types';

import { useIsHrefActive } from 'hooks/useIsHrefActive';
import { useOnRouterChange } from 'hooks/useOnRouterChange';

import { Icon } from 'components/Icon';
import { Popup } from 'components/popup/Popup';

import styles from './NavButton.module.scss';

interface NavButtonProps extends NavItemProps {
  mobile?: boolean;
  className?: string;
}

export const NavButton: VFC<NavButtonProps> = props => {
  const {
    label,
    icon,
    href,
    mobile,
    hoverIcon,
    className,
    authRequired,
  } = props;

  const router = useRouter();

  const { login, accountId } = useAuthContext();

  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  const isActive = useIsHrefActive(href);

  const rootClassName = cn(styles.root, className, {
    [styles.active]: isActive,
    [styles.mobile]: mobile,
  });

  const onMouseOver = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const onRouteChange = useCallback(() => {
    setShowLoader(false);
  }, []);

  useOnRouterChange(onRouteChange);

  function navigate() {
    if (authRequired && !accountId) {
      login();

      return;
    }

    setShowLoader(true);

    router.push(href);
  }

  function renderNavIcon() {
    return showLoader ? (
      <DotsLoader />
    ) : (
      <Icon
        height={16}
        className={styles.icon}
        name={isHovered || isActive ? hoverIcon : icon}
      />
    );
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
        <div className={styles.iconHolder}>{renderNavIcon()}</div>
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.underline} />
      <Popup className={styles.tooltip} anchor={ref}>
        {label}
      </Popup>
    </div>
  );
};
