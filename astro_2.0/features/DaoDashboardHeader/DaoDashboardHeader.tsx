import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { DAO } from 'types/dao';

import { FollowButton } from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';

import { useAuthContext } from 'context/AuthContext';

import { DepositToDaoForm } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm';
import { DaoLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks';
import styles from './DaoDashboardHeader.module.scss';

interface DaoDashboardHeaderProps {
  dao: DAO;
  className?: string;
}

export const DaoDashboardHeader: FC<DaoDashboardHeaderProps> = ({
  className,
  dao: {
    id,
    displayName,
    legal,
    daoMembersList,
    flagCover,
    flagLogo,
    members,
    description,
    links,
  },
}) => {
  const { accountId } = useAuthContext();
  const { t } = useTranslation();
  const canFollow = !daoMembersList.includes(accountId);

  return (
    <div className={cn(styles.root, className)}>
      <section
        className={styles.letterHeadSection}
        style={{
          backgroundImage: `url(${flagCover || '/flags/defaultDaoFlag.png'})`,
        }}
      >
        <DaoLogo src={flagLogo} className={styles.logo} />
      </section>

      <section className={styles.usersSection}>
        <div className={styles.label}>{t('users')}: &nbsp;</div>
        <div className={styles.value}>{members}</div>
      </section>

      <section className={styles.buttonsSection}>
        <DepositToDaoForm
          daoId={id}
          className={!canFollow ? styles.alignRight : undefined}
        />

        {canFollow && <FollowButton daoId={id} daoName={displayName} />}
      </section>

      <section className={styles.descriptionSection}>{description}</section>

      <section className={styles.linksSection}>
        <DaoLinks links={links} legal={legal} />
      </section>
    </div>
  );
};
