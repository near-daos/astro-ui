import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import { useMedia } from 'react-use';

import { JoinDaoButton } from 'astro_2.0/features/DaoDashboardHeader/components/JoinDaoButton';
import { FollowButton } from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';
import { DepositToDaoForm } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { CloneDaoWarning } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { useJoinDao } from 'astro_2.0/features/DaoDashboardHeader/hooks/useJoinDao';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Button } from 'components/button/Button';
import { MobileFullscreenPopup } from 'astro_3.0/components/MobileFullscreenPopup';
import { DaoAssetsSelect } from 'astro_3.0/components/DaoAssetsSelect';

import { DAO } from 'types/dao';
import { UserPermissions } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { useWalletContext } from 'context/WalletContext';

import styles from './DaoHeaderContent.module.scss';

interface Props {
  dao: DAO;
  className?: string;
  onCreateProposal: (
    variant: ProposalVariant,
    initialValues: Record<string, unknown>
  ) => void;
  userPermissions: UserPermissions;
}

export const DaoHeaderContent: FC<Props> = ({
  className,
  dao,
  onCreateProposal,
  userPermissions,
}) => {
  const { id, displayName, daoMembersList, members, daoVersion } = dao;
  const isMobile = useMedia('(max-width: 768px)');
  const { accountId } = useWalletContext();
  const { t } = useTranslation();
  const { formState, reset, getValues } = useFormContext();
  const { flagCover, flagLogo } = getValues();

  const { showButton: showJoinButton, showWarning } = useJoinDao(
    id,
    userPermissions,
    daoMembersList
  );
  const showFollowButton = !daoMembersList.includes(accountId);

  const handleSubmit = useCallback(async () => {
    const cover =
      flagCover && typeof flagCover !== 'string' ? flagCover : dao.flagCover; // await fetchImageData(dao.flagCover);

    const logo =
      flagLogo && typeof flagLogo !== 'string' ? flagLogo : dao.flagLogo; // await fetchImageData(dao.flagLogo);

    onCreateProposal(ProposalVariant.ProposeChangeDaoFlag, {
      flagCover: cover,
      flagLogo: logo,
    });

    // reset({ flagCover, flagLogo }, { keepDirty: false });
  }, [dao.flagCover, dao.flagLogo, flagCover, flagLogo, onCreateProposal]);

  function renderContent() {
    if (formState.isDirty && isMobile) {
      return (
        <MobileFullscreenPopup
          title="Change logo and cover"
          onClose={() => reset({ flagCover: null, flagLogo: null })}
          onSubmit={handleSubmit}
        >
          <DaoAssetsSelect dao={dao} />
        </MobileFullscreenPopup>
      );
    }

    if (formState.isDirty) {
      return (
        <section className={styles.depositSection}>
          <Button
            capitalize
            className={styles.proposeButton}
            variant="secondary"
            size="flex"
            onClick={() => reset({ flagCover: null, flagLogo: null })}
          >
            Cancel
          </Button>
          <Button
            capitalize
            className={styles.proposeButton}
            variant="green"
            size="flex"
            onClick={handleSubmit}
          >
            Propose changes
          </Button>
        </section>
      );
    }

    return (
      <>
        <section className={styles.usersSection}>
          <div className={styles.infoWrapper}>
            <div className={styles.label}>{t('members')}</div>
            <div className={styles.value}>{members}</div>
          </div>
        </section>

        {showFollowButton || showJoinButton ? (
          <section
            className={cn({
              [styles.versionSection]: !isMobile,
              [styles.followSection]: isMobile,
            })}
          >
            <JoinDaoButton
              visible={showJoinButton}
              onClick={onCreateProposal}
              className={styles.joinDao}
            />
            <FollowButton
              visible={showFollowButton}
              daoId={id}
              daoName={displayName}
            />
          </section>
        ) : (
          <section className={styles.versionSection}>
            <div className={styles.infoWrapper}>
              <div className={styles.label}>DAO Version</div>
              <div className={styles.value}>
                {daoVersion?.version.join('.')}{' '}
                <CopyButton
                  defaultTooltip="Copy hash"
                  text={daoVersion.hash}
                  className={styles.copyHash}
                  iconClassName={styles.copyIcon}
                />
              </div>
            </div>
          </section>
        )}

        <section className={styles.depositSection}>
          <DepositToDaoForm daoId={id} />
        </section>
      </>
    );
  }

  return (
    <MainLayout className={styles.contentLayout}>
      <div
        className={cn(styles.root, className, {
          [styles.hideFollow]: !showFollowButton,
        })}
      >
        {renderContent()}
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
            key={dao.id}
            dao={dao}
            className={styles.warning}
            onCreateProposal={onCreateProposal}
          />
        </div>
      </div>
    </MainLayout>
  );
};
