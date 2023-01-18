import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

import { getDaoAvatar } from 'astro_3.0/features/Sidebar/helpers';
import { DaoFeedItem } from 'types/dao';

import styles from './DaoFlag.module.scss';

interface DaoFlagProps {
  dao: Pick<DaoFeedItem, 'id' | 'name' | 'flagLogo' | 'logo'>;
  className?: string;
  hideName?: boolean;
}

export const DaoFlagWidget: React.FC<DaoFlagProps> = ({
  className,
  dao,
  hideName = false,
}) => {
  const avatar = getDaoAvatar(dao);

  return (
    <Link href={`/dao/${dao.id}`} passHref legacyBehavior>
      <div className={cn(styles.root, className)}>
        <div
          className={cn(styles.avatar)}
          style={{
            backgroundImage: `url(${avatar})`,
          }}
        />
        {!hideName && (
          <InfoBlockWidget
            label="DAO name"
            value={dao.name || dao.id}
            className={styles.info}
          />
        )}
      </div>
    </Link>
  );
};
