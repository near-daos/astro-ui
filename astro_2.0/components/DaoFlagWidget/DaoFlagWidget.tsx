import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import styles from './DaoFlag.module.scss';

interface DaoFlagProps {
  daoId: string;
  daoName: string;
  flagUrl?: string;
  className?: string;
}

export const DaoFlagWidget: React.FC<DaoFlagProps> = ({
  daoId,
  daoName,
  flagUrl,
  className,
}) => {
  return (
    <Link href={`/dao/${daoId}`} passHref>
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
    </Link>
  );
};
