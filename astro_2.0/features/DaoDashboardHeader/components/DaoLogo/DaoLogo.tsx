import React, { FC } from 'react';
import cn from 'classnames';
import styles from './DaoLogo.module.scss';

interface DaoLogoProps {
  src: string | undefined | null;
  className?: string;
}

export const DaoLogo: FC<DaoLogoProps> = ({ src, className }) => {
  return (
    <div className={cn(styles.root, className)}>
      {src && (
        <div
          className={styles.logo}
          style={{ backgroundImage: `url(${src})` }}
        />
      )}
    </div>
  );
};
