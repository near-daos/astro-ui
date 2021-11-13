import React, { FC } from 'react';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import TextTruncate from 'react-text-truncate';

import { DAO } from 'types/dao';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ActionButton } from 'features/proposal/components/action-button';
import { FlagRenderer } from 'astro_2.0/components/Flag';

import { useAuthContext } from 'context/AuthContext';

import cn from 'classnames';
import styles from './DaoDetailsMinimized.module.scss';

export interface DaoDetailsMinimizedProps {
  dao: DAO;
  accountId: string | null;
  onCreateProposalClick?: () => void;
  disableNewProposal?: boolean;
}

export const DaoDetailsMinimized: FC<DaoDetailsMinimizedProps> = ({
  dao,
  onCreateProposalClick,
  disableNewProposal = false,
}) => {
  const router = useRouter();

  const currentPath = router.asPath;

  const url = {
    funds: `/dao/${dao.id}/treasury/tokens`,
    members: `/dao/${dao.id}/groups/all-members`,
    settings: `/dao/${dao.id}/governance/settings`,
    nfts: `/dao/${dao.id}/treasury/nfts`,
    bounties: `/dao/${dao.id}/tasks/bounties`,
    polls: `/dao/${dao.id}/tasks/polls`,
  };

  const handleChapterClick = (newUrl: string) => {
    if (newUrl !== currentPath) {
      router.push(newUrl);
    }
  };

  const generateChapterStyle = (chapterUrl: string) => {
    return cn(styles.controlIcon, {
      [styles.active]: currentPath === chapterUrl,
    });
  };

  const { accountId, login } = useAuthContext();
  const action = (
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
      <Icon width={24} name="buttonAdd" />
    </Button>
  );

  return (
    <div className={styles.root}>
      <Link href={`/dao/${dao.id}`}>
        <a>
          <section className={styles.general}>
            <div className={styles.flagWrapper}>
              <FlagRenderer flag={dao.flagCover ?? dao.logo} size="xs" />
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
          tooltip="DAO funds"
          tooltipPlacement="top"
          iconName="funds"
          onClick={() => handleChapterClick(url.funds)}
          className={generateChapterStyle(url.funds)}
        />
        <ActionButton
          tooltip="DAO members"
          tooltipPlacement="top"
          iconName="groups"
          onClick={() => handleChapterClick(url.members)}
          className={generateChapterStyle(url.members)}
        />
        <ActionButton
          tooltip="DAO Settings"
          tooltipPlacement="top"
          iconName="settings"
          onClick={() => handleChapterClick(url.settings)}
          className={generateChapterStyle(url.settings)}
        />
        <ActionButton
          tooltip="NFTs"
          tooltipPlacement="top"
          iconName="nfts"
          onClick={() => handleChapterClick(url.nfts)}
          className={generateChapterStyle(url.nfts)}
        />
        <ActionButton
          tooltip="Bounties"
          tooltipPlacement="top"
          iconName="proposalBounty"
          onClick={() => handleChapterClick(url.bounties)}
          className={generateChapterStyle(url.bounties)}
        />
        <ActionButton
          tooltip="Polls"
          tooltipPlacement="top"
          iconName="proposalPoll"
          onClick={() => handleChapterClick(url.polls)}
          className={generateChapterStyle(url.polls)}
        />
      </section>

      {onCreateProposalClick && !disableNewProposal && (
        <section className={styles.proposals}>{action}</section>
      )}
    </div>
  );
};
