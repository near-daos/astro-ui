import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { useMedia } from 'react-use';

import { DAO } from 'types/dao';

import { JoinDaoButton } from 'astro_2.0/features/DaoDashboardHeader/components/JoinDaoButton';
import { FollowButton } from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { ShowMoreLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/ShowMoreLinks';
import { CopyButton } from 'astro_2.0/components/CopyButton';

import { useWalletContext } from 'context/WalletContext';
import { UserPermissions } from 'types/context';

import { DepositToDaoForm } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm';
import { DaoLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { UpgradeDaoWarning } from 'astro_2.0/features/DaoDashboardHeader/components/UpgradeDaoWarning';
import { CloneDaoWarning } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning';

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
  dao,
  onCreateProposal,
  userPermissions,
}) => {
  const {
    id,
    displayName,
    legal,
    daoMembersList,
    flagCover,
    flagLogo,
    members,
    description,
    links,
    daoVersion,
  } = dao;
  const { accountId } = useWalletContext();
  const { t } = useTranslation();
  const isMobileOrTablet = useMedia('(max-width: 767px)');

  const { showButton: showJoinButton, showWarning } = useJoinDao(
    id,
    userPermissions,
    daoMembersList
  );
  const showFollowButton = !daoMembersList.includes(accountId);

  return (
    <div
      className={cn(styles.root, className, {
        [styles.hideFollow]: !showFollowButton,
      })}
    >
      <section
        className={styles.letterHeadSection}
        style={{
          backgroundImage: `url(${flagCover || '/flags/defaultDaoFlag.png'})`,
        }}
      >
        <DaoLogo src={flagLogo} className={styles.logo} />
        {daoVersion && (
          <div className={styles.currentDaoVersion}>
            DAO Version:&nbsp;<b>{daoVersion?.version.join('.')}</b>
            <CopyButton
              defaultTooltip="Copy hash"
              text={daoVersion.hash}
              className={styles.copyHash}
              iconClassName={styles.copyIcon}
            />
          </div>
        )}
      </section>

      <section className={styles.usersSection}>
        <div className={styles.label}>{t('members')}</div>
        <div className={styles.value}>{members}</div>
      </section>

      {(showFollowButton || showJoinButton || !isMobileOrTablet) && (
        <section className={styles.followSection}>
          {showJoinButton && (
            <JoinDaoButton
              onClick={onCreateProposal}
              className={styles.joinDao}
            />
          )}
          {showFollowButton && (
            <FollowButton daoId={id} daoName={displayName} />
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

      <div className={styles.warningWrapper}>
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
            className={styles.warning}
          />
        )}

        <CloneDaoWarning
          dao={dao}
          userPermissions={userPermissions}
          className={styles.warning}
          onCreateProposal={onCreateProposal}
        />

        <UpgradeDaoWarning
          dao={dao}
          userPermissions={userPermissions}
          className={styles.warning}
        />
      </div>
    </div>
  );
};
