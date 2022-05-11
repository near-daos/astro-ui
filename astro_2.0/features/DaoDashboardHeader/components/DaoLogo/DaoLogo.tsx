import cn from 'classnames';
import React, { FC } from 'react';

import { Icon } from 'components/Icon';

import styles from './DaoLogo.module.scss';

interface DaoLogoProps {
  src: string | undefined | null;
  className?: string;
  size?: 'md';
}

export const DaoLogo: FC<DaoLogoProps> = ({ src, size, className }) => {
  function renderLogo() {
    if (src) {
      return (
        <div
          className={styles.logo}
          style={{ backgroundImage: `url(${src})` }}
        />
      );
    }

    return <Icon name="defaultDaoLogo" className={styles.defaultLogo} />;
  }

  const rootClassName = cn(styles.root, className, {
    [styles.md]: size === 'md',
  });

  return <div className={rootClassName}>{renderLogo()}</div>;
};
