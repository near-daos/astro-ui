import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { FlagRenderer } from 'astro_2.0/components/Flag';

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
        <FlagRenderer flag={flagUrl} size="sm" />
        <InfoBlockWidget
          label="DAO name"
          value={daoName}
          className={styles.info}
        />
      </div>
    </Link>
  );
};
