import cn from 'classnames';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import { useMedia } from 'react-use';
import includes from 'lodash/includes';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { DAO } from 'types/dao';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ActionButton } from 'astro_2.0/components/ActionButton';
import { Popup } from 'components/Popup';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';

import { useWalletContext } from 'context/WalletContext';
import { UserPermissions } from 'types/context';
import { shortenString } from 'utils/format';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ExplorerLink } from 'components/ExplorerLink';

import { WalletType } from 'types/config';
import styles from './DaoDetailsMinimized.module.scss';

export interface DaoDetailsMinimizedProps {
  dao: Pick<DAO, 'id' | 'flagCover' | 'flagLogo' | 'logo' | 'displayName'>;
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
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const isMobile = useMedia('(max-width: 768px)');
  const isXsMobile = useMedia('(max-width: 600px)');
  const tooltipPlacement = isMobile ? 'bottom' : 'top-end';

  const router = useRouter();
  const { t } = useTranslation();
  const { asPath } = router;
  const currentPath = asPath.split('?')[0];

  const url = {
    proposals: `/dao/${dao.id}/proposals`,
    funds: `/dao/${dao.id}/treasury/tokens`,
    members: `/dao/${dao.id}/groups/all`,
    settings: `/dao/${dao.id}/governance/settings`,
    nfts: `/dao/${dao.id}/treasury/nfts`,
    bounties: `/dao/${dao.id}/tasks/bounties/list`,
    polls: `/dao/${dao.id}/tasks/polls`,
  };

  const activeLinkPresent = includes(url, currentPath);

  const handleChapterClick = (newUrl: string) => {
    if (newUrl !== currentPath) {
      router.push(newUrl);
    }
  };

  const generateChapterStyle = (chapter: string) => {
    return cn(styles.controlIcon, {
      [styles.active]: currentPath.indexOf(chapter) !== -1,
      [styles.noActiveLink]: !activeLinkPresent,
    });
  };

  const { accountId, login } = useWalletContext();
  const action = (
    <>
      <div className={styles.addProposalWrapper} ref={setRef}>
        <Button
          data-testid="createProposal"
          size="block"
          onClick={() => {
            if (isEmpty(accountId)) {
              login(WalletType.NEAR);
            } else if (onCreateProposalClick) {
              onCreateProposalClick();
            }
          }}
          className={styles.addProposalButton}
          variant="tertiary"
        >
          <Icon width={32} name="buttonAdd" className={styles.createIcon} />
        </Button>
      </div>
      <Popup
        offset={[0, 10]}
        anchor={ref}
        placement={tooltipPlacement}
        className={styles.createPopup}
      >
        {t('daoDetailsMinimized.createProposal')}
      </Popup>
    </>
  );

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.wrapper}>
        <Link href={`/dao/${dao.id}`}>
          <a>
            <section
              className={cn(
                {
                  [styles.paddingWithNoProposalButton]: !userPermissions.isCanCreateProposals,
                  [styles.paddingWithProposalButton]:
                    userPermissions.isCanCreateProposals,
                },
                styles.general
              )}
            >
              <div className={styles.flagWrapper}>
                <DaoLogo size="md" src={dao.flagLogo} className={styles.logo} />
              </div>
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
                  {shortenString(dao.id, isXsMobile ? 32 : 45)}
                  <CopyButton
                    text={dao.id}
                    tooltipPlacement="auto"
                    className={styles.copyAddress}
                  />
                </div>
              </div>
            </section>
          </a>
        </Link>

        <section className={styles.controls}>
          <ActionButton
            iconName="pencil"
            onClick={() => handleChapterClick(url.proposals)}
            className={generateChapterStyle('proposals')}
          >
            {t('daoDetailsMinimized.proposals')}
          </ActionButton>
          <ActionButton
            iconName="funds"
            onClick={() => handleChapterClick(url.funds)}
            className={generateChapterStyle('tokens')}
          >
            {t('daoDetailsMinimized.funds')}
          </ActionButton>
          <ActionButton
            iconName="groups"
            onClick={() => handleChapterClick(url.members)}
            className={generateChapterStyle('groups')}
          >
            {t('daoDetailsMinimized.members')}
          </ActionButton>
          <ActionButton
            iconName="settings"
            onClick={() => handleChapterClick(url.settings)}
            className={generateChapterStyle('settings')}
          >
            {t('daoDetailsMinimized.settings')}
          </ActionButton>
          <ActionButton
            iconName="nfts"
            onClick={() => handleChapterClick(url.nfts)}
            className={generateChapterStyle('nfts')}
          >
            {t('daoDetailsMinimized.nfts')}
          </ActionButton>
          <ActionButton
            iconName="proposalBounty"
            onClick={() => handleChapterClick(url.bounties)}
            className={generateChapterStyle('bounties')}
          >
            {t('daoDetailsMinimized.bounties')}
          </ActionButton>
          <ActionButton
            iconName="proposalPoll"
            onClick={() => handleChapterClick(url.polls)}
            className={generateChapterStyle('polls')}
          >
            {t('daoDetailsMinimized.polls')}
          </ActionButton>
        </section>

        {onCreateProposalClick && userPermissions.isCanCreateProposals && (
          <section className={styles.proposals}>{action}</section>
        )}
      </div>
    </div>
  );
};
