import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { useMedia } from 'react-use';

import { DAO } from 'types/dao';

import { JoinDaoButton } from 'astro_2.0/features/DaoDashboardHeader/components/JoinDaoButton';
import { FollowButton } from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { ShowMoreLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/ShowMoreLinks';

import { useAuthContext } from 'context/AuthContext';
import { UserPermissions } from 'types/context';

import { DepositToDaoForm } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm';
import { DaoLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';

import { useJoinDao } from 'astro_2.0/features/DaoDashboardHeader/components/hooks';

import styles from './DaoDashboardHeader.module.scss';

interface DaoDashboardHeaderProps {
  dao: DAO;
  className?: string;
  onCreateProposal: () => void;
  userPermissions: UserPermissions;
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
  onCreateProposal,
  userPermissions,
}) => {
  const { accountId } = useAuthContext();
  const { t } = useTranslation();
  const isMobileOrTablet = useMedia('(max-width: 767px)');

  const { showButton, showWarning } = useJoinDao(
    id,
    userPermissions,
    daoMembersList
  );

  return (
    <div
      className={cn(styles.root, className, {
        [styles.hideFollow]: daoMembersList.includes(accountId),
      })}
    >
      <section
        className={styles.letterHeadSection}
        style={{
          backgroundImage: `url(${flagCover || '/flags/defaultDaoFlag.png'})`,
        }}
      >
        <DaoLogo src={flagLogo} className={styles.logo} />
      </section>

      <section className={styles.usersSection}>
        <div className={styles.label}>{t('members')}</div>
        <div className={styles.value}>{members}</div>
      </section>

      {(!daoMembersList.includes(accountId) || showButton) && (
        <section className={styles.followSection}>
          {!daoMembersList.includes(accountId) && (
            <FollowButton daoId={id} daoName={displayName} />
          )}
          {showButton && (
            <JoinDaoButton
              onClick={onCreateProposal}
              className={styles.joinDao}
            />
          )}
          {!isMobileOrTablet && (
            <div className={styles.link}>
              <ShowMoreLinks links={links} />
            </div>
          )}
        </section>
      )}

      {isMobileOrTablet && (
        <div className={styles.link}>
          <DaoLinks links={links} legal={legal} />
        </div>
      )}

      <section className={styles.depositSection}>
        <DepositToDaoForm daoId={id} />
      </section>

      {description && (
        <section className={styles.descriptionSection}>{description}</section>
      )}

      {showWarning && (
        <DaoWarning
          content={
            <>
              <div className={styles.title}>
                Your request to join is pending
              </div>
              <div className={styles.text}>
                If your membership request is approved, you will be notified.
              </div>
            </>
          }
          className={styles.warningWrapper}
        />
      )}
    </div>
  );
};
