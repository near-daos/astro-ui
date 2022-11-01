import cn from 'classnames';
import Link from 'next/link';
import { useMedia } from 'react-use';
import includes from 'lodash/includes';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { DAO } from 'types/dao';

import { ActionButton } from 'astro_2.0/components/ActionButton';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { DaoAction } from 'astro_2.0/components/DaoDetails/DaoDetailsMinimized/components/DaoAction';
import { ExplorerLink } from 'components/ExplorerLink';
import { CopyButton } from 'astro_2.0/components/CopyButton';

import { UserPermissions } from 'types/context';
import { shortenString } from 'utils/format';

import { useDaoSettings } from 'context/DaoSettingsContext';
import { useUnreadDraftCount } from 'hooks/useDraft';
import { useWalletContext } from 'context/WalletContext';
import { useUnreadDraftProposalsCount } from 'services/ApiService/hooks/useUnreadDraftProposalsCount';

import styles from './DaoDetailsMinimized.module.scss';

export interface DaoDetailsMinimizedProps {
  dao: Pick<
    DAO,
    | 'id'
    | 'flagCover'
    | 'flagLogo'
    | 'logo'
    | 'displayName'
    | 'stakingContract'
    | 'daoMembersList'
  >;
  className?: string;
  onCreateProposalClick?: () => void;
  disableNewProposal?: boolean;
  userPermissions: UserPermissions;
}

export const DaoDetailsMinimized: FC<DaoDetailsMinimizedProps> = ({
  dao,
  className,
  onCreateProposalClick,
  userPermissions,
}) => {
  const { accountId } = useWalletContext();
  const { settings } = useDaoSettings();
  const isXsMobile = useMedia('(max-width: 600px)');
  const isMobile = useMedia('(max-width: 768px)');
  const flags = useFlags();
  const router = useRouter();
  const { t } = useTranslation();
  const { asPath } = router;
  const currentPath = asPath.split('?')[0];
  const unreadDraftsApi = useUnreadDraftCount(dao.id);
  const unreadDraftsOs = useUnreadDraftProposalsCount(dao.id);
  const unreadDrafts = unreadDraftsApi || unreadDraftsOs;

  const daoHasGovernanceTokenConfigured =
    settings?.createGovernanceToken?.wizardCompleted;

  const url = {
    delegates: `/dao/${dao.id}/delegate`,
    drafts: `/dao/${dao.id}/drafts`,
    proposals: `/dao/${dao.id}/proposals`,
    funds: `/dao/${dao.id}/treasury/tokens`,
    members: `/dao/${dao.id}/groups/all`,
    settings: `/dao/${dao.id}/governance/settings`,
    nfts: `/dao/${dao.id}/treasury/nfts`,
    bounties: `/dao/${dao.id}/tasks/bounties/list`,
    polls: `/dao/${dao.id}/tasks/polls`,
  };

  const activeLinkPresent = includes(url, currentPath);

  const generateChapterStyle = (chapter: string) => {
    return cn(styles.controlIcon, {
      [styles.active]: currentPath.indexOf(chapter) !== -1,
      [styles.noActiveLink]: !activeLinkPresent,
    });
  };

  function renderDaoLink() {
    return (
      <Link href={`/dao/${dao.id}`}>
        <a>
          <section className={cn(styles.nextPadding, styles.general)}>
            {!isMobile && (
              <div className={styles.flagWrapper}>
                <DaoLogo size="md" src={dao.flagLogo} className={styles.logo} />
              </div>
            )}

            <div>
              <div className={styles.displayName}>
                <div className={styles.name}>
                  {shortenString(dao.displayName, isXsMobile ? 25 : 40)}
                </div>

                <ExplorerLink
                  linkData={dao.id}
                  linkType="member"
                  className={styles.explorerLink}
                />
              </div>

              <div className={styles.daoId}>
                <CopyButton
                  text={dao.id}
                  tooltipPlacement="auto"
                  className={styles.copyAddress}
                >
                  <div className={styles.daoId}>
                    {shortenString(dao.id, isXsMobile ? 32 : 45)}
                  </div>
                </CopyButton>
              </div>
            </div>
          </section>
        </a>
      </Link>
    );
  }

  function renderNewProposalButton() {
    return (
      <DaoAction
        canCreateProposals={userPermissions.isCanCreateProposals}
        onCreateProposalClick={onCreateProposalClick}
        daoId={dao.id}
        dao={dao}
      />
    );
  }

  return (
    <div
      className={cn(styles.root, className, {
        [styles.nextVersion]: isMobile,
      })}
    >
      {isMobile && renderDaoLink()}
      <div className={styles.wrapper}>
        {!isMobile && renderDaoLink()}

        <section className={styles.controls}>
          {flags.delegateVoting && daoHasGovernanceTokenConfigured && (
            <ActionButton
              href={url.delegates}
              iconName="delegate"
              className={generateChapterStyle('delegates')}
            >
              {t('daoDetailsMinimized.delegates')}
            </ActionButton>
          )}
          <ActionButton
            notifications={unreadDrafts}
            href={url.drafts}
            iconName="sheet"
            className={generateChapterStyle('drafts')}
          >
            {t('daoDetailsMinimized.drafts')}
          </ActionButton>
          <ActionButton
            href={url.proposals}
            iconName="pencil"
            className={generateChapterStyle('proposals')}
          >
            {t('daoDetailsMinimized.proposals')}
          </ActionButton>

          <ActionButton
            href={url.funds}
            iconName="funds"
            className={generateChapterStyle('tokens')}
          >
            {t('daoDetailsMinimized.funds')}
          </ActionButton>

          <ActionButton
            href={url.members}
            iconName="groups"
            className={generateChapterStyle('groups')}
          >
            {t('daoDetailsMinimized.members')}
          </ActionButton>

          <ActionButton
            href={url.settings}
            iconName="settings"
            className={generateChapterStyle('settings')}
          >
            {t('daoDetailsMinimized.settings')}
          </ActionButton>

          <ActionButton
            href={url.nfts}
            iconName="nfts"
            className={generateChapterStyle('nfts')}
          >
            {t('daoDetailsMinimized.nfts')}
          </ActionButton>

          <ActionButton
            href={url.bounties}
            iconName="proposalBounty"
            className={generateChapterStyle('bounties')}
          >
            {t('daoDetailsMinimized.bounties')}
          </ActionButton>

          <ActionButton
            href={url.polls}
            iconName="proposalPoll"
            className={generateChapterStyle('polls')}
          >
            {t('daoDetailsMinimized.polls')}
          </ActionButton>
        </section>

        {!isMobile && onCreateProposalClick && !!accountId && (
          <section className={styles.proposals}>
            {renderNewProposalButton()}
          </section>
        )}
      </div>
      {isMobile && (
        <div className={styles.daoAction}>{renderNewProposalButton()}</div>
      )}
    </div>
  );
};
