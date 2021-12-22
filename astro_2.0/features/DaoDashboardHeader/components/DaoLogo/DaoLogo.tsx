import cn from 'classnames';
import React, { FC } from 'react';

import { Icon } from 'components/Icon';

import styles from './DaoLogo.module.scss';

interface DaoLogoProps {
  src: string | undefined | null;
  className?: string;
}

export const DaoLogo: FC<DaoLogoProps> = ({ src, className }) => {
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

  return <div className={cn(styles.root, className)}>{renderLogo()}</div>;
};
