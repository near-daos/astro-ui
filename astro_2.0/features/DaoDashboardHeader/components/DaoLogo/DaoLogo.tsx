import cn from 'classnames';
import React, { FC } from 'react';

import { Icon } from 'components/Icon';

import { useAppVersion } from 'hooks/useAppVersion';

import styles from './DaoLogo.module.scss';

interface DaoLogoProps {
  src: string | undefined | null;
  className?: string;
  size?: 'md';
}

export const DaoLogo: FC<DaoLogoProps> = ({ src, size, className }) => {
  const { appVersion } = useAppVersion();

  function renderLogo() {
    if (src) {
      return (
        <div
          className={styles.logo}
          style={{ backgroundImage: `url(${src})` }}
        />
      );
    }

    if (appVersion === 3) {
      return (
        <div
          className={styles.logo}
          style={{
            backgroundSize: '105% 105%',
            backgroundImage: `url(/avatars/avatar1.png)`,
          }}
        />
      );
    }

    return <Icon name="defaultDaoLogo" className={styles.defaultLogo} />;
  }

  const rootClassName = cn(styles.root, className, {
    [styles.md]: size === 'md',
    [styles.square]: appVersion === 3,
  });

  return <div className={rootClassName}>{renderLogo()}</div>;
};
