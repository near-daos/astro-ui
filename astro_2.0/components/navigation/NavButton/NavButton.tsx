import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { useCallback, useState, VFC } from 'react';

import { useWalletContext } from 'context/WalletContext';

import { DotsLoader } from 'astro_2.0/components/DotsLoader';
import { NavItemProps } from 'astro_2.0/components/navigation/types';

import { useIsHrefActive } from 'hooks/useIsHrefActive';
import { useOnRouterChange } from 'hooks/useOnRouterChange';

import { Icon } from 'components/Icon';
import { Popup } from 'components/Popup';

import { ALL_DAOS_URL, MY_DAOS_URL } from 'constants/routing';

import { WalletType } from 'types/config';
import styles from './NavButton.module.scss';

export interface NavButtonProps extends NavItemProps {
  mobile?: boolean;
  className?: string;
  myDaosIds: string[];
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
    myDaosIds,
  } = props;

  const router = useRouter();

  const { login, accountId } = useWalletContext();

  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  const daoId = router.query.dao as string;
  const daoIsMine = myDaosIds.indexOf(daoId) >= 0;

  const isActive =
    useIsHrefActive(href) ||
    (daoIsMine && href === MY_DAOS_URL) ||
    (daoId && !daoIsMine && href === ALL_DAOS_URL);

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
      login(WalletType.NEAR);

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
