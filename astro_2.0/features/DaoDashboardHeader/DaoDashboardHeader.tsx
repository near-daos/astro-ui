import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { useMedia } from 'react-use';
import { FormProvider, useForm } from 'react-hook-form';

import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import { JoinDaoButton } from 'astro_2.0/features/DaoDashboardHeader/components/JoinDaoButton';
import { FollowButton } from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';
import { ShowMoreLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/ShowMoreLinks';
import { DaoLetterHeadSection } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLetterHeadSection';

import { useWalletContext } from 'context/WalletContext';
import { UserPermissions } from 'types/context';

import { DepositToDaoForm } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm';
import { DaoLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { CloneDaoWarning } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning';

import { useJoinDao } from 'astro_2.0/features/DaoDashboardHeader/hooks/useJoinDao';

import { DaoHeaderContent } from 'astro_2.0/features/DaoDashboardHeader/components/DaoHeaderContent';
import { useAppVersion } from 'hooks/useAppVersion';

import { MainLayout } from 'astro_3.0/features/MainLayout';

import styles from './DaoDashboardHeader.module.scss';

interface DaoDashboardHeaderProps {
  dao: DAO;
  className?: string;
  onCreateProposal: (
    variant: ProposalVariant,
    initialValues: Record<string, unknown>
  ) => void;
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
    members,
    description,
    links,
  } = dao;
  const { accountId } = useWalletContext();
  const { t } = useTranslation();
  const { appVersion } = useAppVersion();
  const isNextVersion = appVersion === 3;
  const isMobileOrTablet = useMedia('(max-width: 767px)');

  const methods = useForm<{
    flagCover: FileList;
    flagLogo: FileList;
    defaultFlag: string;
  }>({
    mode: 'onChange',
  });

  const { showButton: showJoinButton, showWarning } = useJoinDao(
    id,
    userPermissions,
    daoMembersList
  );
  const showFollowButton = !daoMembersList.includes(accountId);

  return (
    <FormProvider {...methods}>
      <DaoLetterHeadSection
        dao={dao}
        onCreateProposal={onCreateProposal}
        userPermissions={userPermissions}
      />
      {isNextVersion ? (
        <DaoHeaderContent
          dao={dao}
          onCreateProposal={onCreateProposal}
          userPermissions={userPermissions}
          className={className}
        />
      ) : (
        <MainLayout className={styles.headerLayout}>
          <div
            className={cn(styles.root, className, {
              [styles.hideFollow]: !showFollowButton,
            })}
          >
            <section className={styles.usersSection}>
              <div className={styles.label}>{t('members')}</div>
              <div className={styles.value}>{members}</div>
            </section>

            {(showFollowButton || showJoinButton || !isMobileOrTablet) && (
              <section className={styles.followSection}>
                <JoinDaoButton
                  visible={showJoinButton}
                  onClick={onCreateProposal}
                  className={styles.joinDao}
                />
                <FollowButton
                  daoId={id}
                  daoName={displayName}
                  visible={showFollowButton}
                />
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
              <section className={styles.descriptionSection}>
                {description}
              </section>
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
                        If your membership request is approved, you will be
                        notified.
                      </div>
                    </>
                  }
                  className={styles.warning}
                />
              )}
              <CloneDaoWarning
                dao={dao}
                className={styles.warning}
                onCreateProposal={onCreateProposal}
              />
            </div>
          </div>
        </MainLayout>
      )}
    </FormProvider>
  );
};
