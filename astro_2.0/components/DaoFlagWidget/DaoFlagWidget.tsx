import React from 'react';
import styles from 'astro_2.0/components/DaoFlagWidget/DaoFlag.module.scss';
import cn from 'classnames';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

interface DaoFlagProps {
  daoName: string;
  flagUrl: string;
  className?: string;
}

export const DaoFlagWidget: React.FC<DaoFlagProps> = ({
  daoName,
  flagUrl,
  className,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.flag}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={flagUrl} height={52} width={46} alt="DAO flag" />
      </div>
      <InfoBlockWidget
        label="DAO name"
        value={daoName}
        className={styles.info}
      />
    </div>
  );
};
