import React, { ComponentType, FC } from 'react';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';
import { useMeasure, useMedia } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { UrlObject } from 'url';

import { ALL_BOUNTIES_PAGE_URL, GROUPS_PAGE_URL } from 'constants/routing';

import { DaoFeedItem } from 'types/dao';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ActionButton } from 'astro_2.0/components/ActionButton';
import * as Typography from 'components/Typography';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import { shortenString } from 'utils/format';
import { formatCurrency } from 'utils/formatCurrency';
import { getDaoAvatar } from 'astro_3.0/features/Sidebar/helpers';

import { ExplorerLink } from 'components/ExplorerLink';
import { DaoInfoCard } from './components/DaoInfoCard';
import { DaoDetailsSkeleton } from './components/DaoDetailsSkeleton';

import styles from './DaoDetailsGrid.module.scss';

export interface DaoDetailsGridProps {
  dao: DaoFeedItem;
  activeProposals: number;
  totalProposals: number;
  loading?: boolean;
}

const TextTruncateSafeForReact18 = TextTruncate as ComponentType<
  TextTruncate['props']
>;

export const DaoDetailsGrid: FC<DaoDetailsGridProps> = ({
  dao,
  activeProposals,
  totalProposals,
  loading,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    id,
    displayName,
    description,
    numberOfMembers,
    numberOfGroups,
    totalDaoFunds,
  } = dao;
  const isMobile = useMedia('(max-width: 920px)');

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    url: string | UrlObject
  ) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(url);
  };

  const [measureRef, { width }] = useMeasure<HTMLDivElement>();

  const avatar = getDaoAvatar(dao);

  return (
    <div className={styles.root} ref={measureRef}>
      {loading ? (
        <DaoDetailsSkeleton />
      ) : (
        <Link href={`/dao/${id}`} className={styles.content}>
          <div>
            <section className={styles.general}>
              <div className={styles.flagWrapper}>
                <div
                  className={cn(styles.avatar)}
                  style={{
                    backgroundImage: `url(${avatar})`,
                  }}
                />
              </div>
              <div className={styles.title}>
                <ExplorerLink
                  linkData={dao.id}
                  linkType="member"
                  className={styles.explorerLink}
                />
                <Tooltip
                  placement="top"
                  overlay={
                    <span className={styles.nameTooltip}>
                      {displayName || id}
                    </span>
                  }
                >
                  <div
                    className={styles.name}
                    style={{
                      maxWidth: width - 142,
                    }}
                  >
                    {displayName || id}
                  </div>
                </Tooltip>
                <div className={styles.address}>
                  <CopyButton
                    text={id}
                    tooltipPlacement="auto"
                    className={styles.copyAddress}
                  >
                    <div className={styles.addressId}>
                      {shortenString(id, isMobile ? 16 : 26)}
                    </div>
                  </CopyButton>
                </div>
              </div>
            </section>

            <section className={styles.description}>
              <TextTruncateSafeForReact18
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
              <DaoInfoCard
                infoType="funds"
                url={`/dao/${id}/treasury/tokens`}
                title={t('daoFunds')}
                daoFunds={formatCurrency(Number(totalDaoFunds ?? 0))}
                tooltip={t('daoFunds')}
              />
              <DaoInfoCard
                infoType="members"
                url={{
                  pathname: GROUPS_PAGE_URL,
                  query: {
                    dao: dao.id,
                    group: 'all',
                  },
                }}
                title={t('membersGroups')}
                members={numberOfMembers}
                groups={numberOfGroups}
                tooltip={t('daoMembers')}
              />
            </section>

            <section className={styles.controls}>
              <ActionButton
                iconName="settings"
                onClick={e => handleClick(e, `/dao/${id}/governance/settings`)}
                className={styles.controlIcon}
              >
                {t('settings')}
              </ActionButton>
              <ActionButton
                iconName="nfts"
                onClick={e => handleClick(e, `/dao/${id}/treasury/nfts`)}
                className={styles.controlIcon}
              >
                {t('nfts')}
              </ActionButton>
              <ActionButton
                iconName="proposalBounty"
                onClick={e =>
                  handleClick(e, {
                    pathname: ALL_BOUNTIES_PAGE_URL,
                    query: {
                      dao: id,
                    },
                  })
                }
                className={styles.controlIcon}
              >
                {t('bounties')}
              </ActionButton>
              <ActionButton
                iconName="proposalPoll"
                onClick={e => handleClick(e, `/dao/${id}/tasks/polls`)}
                className={styles.controlIcon}
              >
                {t('polls')}
              </ActionButton>
            </section>

            <section className={styles.proposals}>
              <Typography.Subtitle
                className={cn(styles.proposalsTitle, styles.active)}
                size={2}
              >
                <span>{activeProposals}</span>{' '}
                {activeProposals === 1
                  ? t('components.daoDetails.proposalTrackerCard.active')
                  : t(
                      'components.daoDetails.proposalTrackerCard.activePlural'
                    )}{' '}
                {activeProposals === 1
                  ? t('components.daoDetails.proposalTrackerCard.proposal')
                  : t('components.daoDetails.proposalTrackerCard.proposals')}
              </Typography.Subtitle>
              <Typography.Subtitle
                className={styles.proposalsSubtitle}
                size={6}
              >
                {`${totalProposals} ${t(
                  'components.daoDetails.proposalTrackerCard.proposalsInTotal'
                )}`}
              </Typography.Subtitle>
            </section>
          </div>
        </Link>
      )}
    </div>
  );
};
