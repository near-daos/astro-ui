import cn from 'classnames';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import { useMedia } from 'react-use';
import includes from 'lodash/includes';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import TextTruncate from 'react-text-truncate';
import { useTranslation } from 'next-i18next';

import { DAO } from 'types/dao';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ActionButton } from 'features/proposal/components/action-button';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { Popup } from 'components/Popup';

import { useAuthContext } from 'context/AuthContext';

import styles from './DaoDetailsMinimized.module.scss';

export interface DaoDetailsMinimizedProps {
  dao: DAO;
  className?: string;
  onCreateProposalClick?: () => void;
  disableNewProposal?: boolean;
}

export const DaoDetailsMinimized: FC<DaoDetailsMinimizedProps> = ({
  dao,
  className,
  onCreateProposalClick,
  disableNewProposal = false,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const isMobile = useMedia('(max-width: 768px)');
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
    bounties: `/dao/${dao.id}/tasks/bounties`,
    polls: `/dao/${dao.id}/tasks/polls`,
  };

  const activeLinkPresent = includes(url, currentPath);

  const handleChapterClick = (newUrl: string) => {
    if (newUrl !== currentPath) {
      router.push(newUrl);
    }
  };

  const generateChapterStyle = (chapterUrl: string) => {
    return cn(styles.controlIcon, {
      [styles.active]: currentPath === chapterUrl,
      [styles.noActiveLink]: !activeLinkPresent,
    });
  };

  const { accountId, login } = useAuthContext();
  const action = (
    <>
      <div className={styles.addProposalWrapper} ref={setRef}>
        <Button
          size="block"
          onClick={() => {
            if (isEmpty(accountId)) {
              login();
            } else if (onCreateProposalClick) {
              onCreateProposalClick();
            }
          }}
          className={styles.addProposalButton}
          variant="tertiary"
        >
          <Icon width={44} name="buttonAdd" className={styles.createIcon} />
          <span className={styles.createText}>
            {t('daoDetailsMinimized.createProposal')}
          </span>
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
      <Link href={`/dao/${dao.id}`}>
        <a>
          <section className={styles.general}>
            <div className={styles.flagWrapper}>
              <FlagRenderer
                flag={dao.flagCover}
                size="xs"
                fallBack={dao.logo}
              />
            </div>
            <div>
              <div className={styles.displayName}>
                <TextTruncate
                  line={1}
                  element="div"
                  truncateText="…"
                  text={dao.displayName}
                  textTruncateChild={null}
                />
              </div>
              <div className={styles.daoId}>
                <TextTruncate
                  line={1}
                  element="div"
                  truncateText="…"
                  text={dao.id}
                  textTruncateChild={null}
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
          className={generateChapterStyle(url.proposals)}
        >
          {t('daoDetailsMinimized.proposals')}
        </ActionButton>
        <ActionButton
          iconName="funds"
          onClick={() => handleChapterClick(url.funds)}
          className={generateChapterStyle(url.funds)}
        >
          {t('daoDetailsMinimized.funds')}
        </ActionButton>
        <ActionButton
          iconName="groups"
          onClick={() => handleChapterClick(url.members)}
          className={generateChapterStyle(url.members)}
        >
          {t('daoDetailsMinimized.members')}
        </ActionButton>
        <ActionButton
          iconName="settings"
          onClick={() => handleChapterClick(url.settings)}
          className={generateChapterStyle(url.settings)}
        >
          {t('daoDetailsMinimized.settings')}
        </ActionButton>
        <ActionButton
          iconName="nfts"
          onClick={() => handleChapterClick(url.nfts)}
          className={generateChapterStyle(url.nfts)}
        >
          {t('daoDetailsMinimized.nfts')}
        </ActionButton>
        <ActionButton
          iconName="proposalBounty"
          onClick={() => handleChapterClick(url.bounties)}
          className={generateChapterStyle(url.bounties)}
        >
          {t('daoDetailsMinimized.bounties')}
        </ActionButton>
        <ActionButton
          iconName="proposalPoll"
          onClick={() => handleChapterClick(url.polls)}
          className={generateChapterStyle(url.polls)}
        >
          {t('daoDetailsMinimized.polls')}
        </ActionButton>
      </section>

      {onCreateProposalClick && !disableNewProposal && (
        <section className={styles.proposals}>{action}</section>
      )}
    </div>
  );
};
