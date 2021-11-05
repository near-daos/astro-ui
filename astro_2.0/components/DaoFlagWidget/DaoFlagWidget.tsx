import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { FlagMinimized } from 'astro_2.0/components/Flag/FlagMinimized';

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
        <FlagMinimized image={flagUrl} />
        <InfoBlockWidget
          label="DAO name"
          value={daoName}
          className={styles.info}
        />
      </div>
    </Link>
  );
};
