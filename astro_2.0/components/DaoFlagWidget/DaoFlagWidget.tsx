import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';

import styles from './DaoFlag.module.scss';

interface DaoFlagProps {
  daoId: string;
  daoName: string;
  flagUrl?: string;
  fallBack?: string;
  className?: string;
}

export const DaoFlagWidget: React.FC<DaoFlagProps> = ({
  daoId,
  daoName,
  flagUrl,
  className,
  fallBack,
}) => {
  return (
    <Link href={`/dao/${daoId}`} passHref>
      <div className={cn(styles.root, className)}>
        <DaoLogo src={flagUrl || fallBack} size="md" />
        <InfoBlockWidget
          label="DAO name"
          value={daoName}
          className={styles.info}
        />
      </div>
    </Link>
  );
};
