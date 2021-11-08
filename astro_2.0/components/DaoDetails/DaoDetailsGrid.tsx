import React, { FC } from 'react';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DAO } from 'types/dao';

import { DaoFunds } from 'astro_2.0/components/DaoDetails/components/DaoFunds';
import { DaoMembers } from 'astro_2.0/components/DaoDetails/components/DaoMembers';
import { CopyButton } from 'features/copy-button';
import TextTruncate from 'react-text-truncate';
import { Button } from 'components/button/Button';
import { ActionButton } from 'features/proposal/components/action-button';
import * as Typography from 'components/Typography';

import cn from 'classnames';
import styles from './DaoDetailsGrid.module.scss';

export interface DaoDetailsGridProps {
  dao: DAO;
  accountId?: string | null;
  onCreateProposalClick?: (dao: DAO) => void;
  activeProposals: number;
  totalProposals: number;
}

export const DaoDetailsGrid: FC<DaoDetailsGridProps> = ({
  dao,
  accountId,
  onCreateProposalClick,
  activeProposals,
  totalProposals,
}) => {
  const router = useRouter();
  const {
    id,
    displayName,
    description,
    flagCover,
    logo: oldFlag,
    members,
    groups,
    funds,
  } = dao;

  const action = isEmpty(accountId) ? null : <>Create proposal</>;
  const isOldFlag = !flagCover?.length;
  const flagUrl = isOldFlag ? oldFlag : flagCover;

  return (
    <div className={styles.root}>
      <div>
        <section className={styles.general}>
          <Link href={`/dao/${id}`}>
            <a>
              <div className={styles.flag}>
                <svg
                  className="svg"
                  width="0"
                  height="0"
                  style={{ position: 'absolute' }}
                >
                  <clipPath id="flag">
                    <path d="M68.8249 0L14.4555 19.4307V30.2124L0 35.3785V78.0007L54.3694 58.57V47.7883L68.8249 42.6222V0Z" />
                  </clipPath>
                </svg>
                <div className={styles.background} />
                <div
                  className={cn(styles.cover, {
                    [styles.scaled]: isOldFlag,
                  })}
                  style={{ backgroundImage: `url(${flagUrl})` }}
                />
              </div>
            </a>
          </Link>
          <div className={styles.title}>
            <div className={styles.name}>
              <Link href={`/dao/${id}`}>
                <a>
                  <div className={styles.displayName}>{displayName || id}</div>
                </a>
              </Link>
            </div>
            <div className={styles.address}>
              {id}
              <CopyButton text={id} className={styles.copyIcon} />
            </div>
          </div>
        </section>

        <section className={styles.description}>
          <TextTruncate
            line={3}
            element="span"
            truncateText="…"
            text={description ?? ''}
            textTruncateChild={null}
          />
        </section>
      </div>
      <div>
        <section className={styles.fundsAndMembers}>
          <DaoFunds
            daoId={id}
            daoFunds={funds}
            tooltip="DAO funds"
            tooltipPlacement="top"
          />
          <DaoMembers
            daoId={id}
            groups={groups.length}
            members={members}
            tooltip="DAO members"
            tooltipPlacement="top"
          />
        </section>

        <section className={styles.controls}>
          <ActionButton
            className={styles.controlIcon}
            iconName="settings"
            onClick={() => {
              router.push(`/dao/${id}/governance/settings`);
            }}
            tooltip="DAO Settings"
            tooltipPlacement="top"
          />
          <ActionButton
            className={styles.controlIcon}
            iconName="nfts"
            onClick={() => {
              router.push(`/dao/${id}/treasury/nfts`);
            }}
            tooltip="NFTs"
            tooltipPlacement="top"
          />
          <ActionButton
            className={styles.controlIcon}
            iconName="proposalBounty"
            onClick={() => {
              router.push(`/dao/${id}/tasks/bounties`);
            }}
            tooltip="Bounties"
            tooltipPlacement="top"
          />
          <ActionButton
            className={styles.controlIcon}
            iconName="proposalPoll"
            onClick={() => {
              router.push(`/dao/${id}/tasks/polls`);
            }}
            tooltip="Polls"
            tooltipPlacement="top"
          />
        </section>

        <section className={styles.proposals}>
          <Typography.Subtitle
            className={cn(styles.proposalsTitle, styles.active)}
            size={2}
          >
            <span>{activeProposals}</span> active{' '}
            {activeProposals === 1 ? 'proposal' : 'proposals'}
          </Typography.Subtitle>
          <Typography.Subtitle className={styles.proposalsSubtitle} size={6}>
            {`${totalProposals} proposals in total`}
          </Typography.Subtitle>
        </section>

        <section className={styles.actionWrapper}>
          {action && (
            <Button
              onClick={() => onCreateProposalClick?.(dao)}
              className={styles.action}
              variant="tertiary"
            >
              {action}
            </Button>
          )}
        </section>
      </div>
    </div>
  );
};
