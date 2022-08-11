import React, { FC } from 'react';
import cn from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTranslation } from 'next-i18next';
import { useMedia } from 'react-use';
import { useFormContext } from 'react-hook-form';

import { JoinDaoButton } from 'astro_2.0/features/DaoDashboardHeader/components/JoinDaoButton';
import { FollowButton } from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';
import { DaoLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks';
import { DepositToDaoForm } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { CloneDaoWarning } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { useJoinDao } from 'astro_2.0/features/DaoDashboardHeader/components/hooks';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Button } from 'components/button/Button';

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
  const {
    id,
    displayName,
    legal,
    daoMembersList,
    members,
    description,
    links,
    daoVersion,
  } = dao;
  const flags = useFlags();
  const { accountId } = useWalletContext();
  const { t } = useTranslation();
  const isMobileOrTablet = useMedia('(max-width: 767px)');
  const { formState, reset, getValues } = useFormContext();
  const { flagCover, flagLogo } = getValues();

  const { showButton: showJoinButton, showWarning } = useJoinDao(
    id,
    userPermissions,
    daoMembersList
  );
  const showFollowButton = !daoMembersList.includes(accountId);

  return (
    <MainLayout className={styles.contentLayout}>
      <div
        className={cn(styles.root, className, {
          [styles.hideFollow]: !showFollowButton,
        })}
      >
        {formState.isDirty ? (
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
              onClick={async () => {
                const cover =
                  flagCover && typeof flagCover !== 'string'
                    ? flagCover
                    : dao.flagCover; // await fetchImageData(dao.flagCover);

                const logo =
                  flagLogo && typeof flagLogo !== 'string'
                    ? flagLogo
                    : dao.flagLogo; // await fetchImageData(dao.flagLogo);

                onCreateProposal(ProposalVariant.ProposeChangeDaoFlag, {
                  flagCover: cover,
                  flagLogo: logo,
                });

                // reset({ flagCover: null, flagLogo: null });
              }}
            >
              Propose changes
            </Button>
          </section>
        ) : (
          <>
            <section className={styles.usersSection}>
              <div className={styles.label}>{t('members')}</div>
              <div className={styles.value}>{members}</div>
            </section>

            {showFollowButton || showJoinButton ? (
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
              </section>
            ) : (
              <section className={styles.versionSection}>
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
          </>
        )}

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
                    If your membership request is approved, you will be
                    notified.
                  </div>
                </>
              }
              className={styles.warning}
            />
          )}

          {flags.cloneDaoFlow && (
            <CloneDaoWarning
              dao={dao}
              className={styles.warning}
              onCreateProposal={onCreateProposal}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};
