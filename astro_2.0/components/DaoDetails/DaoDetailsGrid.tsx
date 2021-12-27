import React, { FC } from 'react';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';
import { useMeasure, useMedia } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { GROUPS_PAGE_URL } from 'constants/routing';

import { DAO } from 'types/dao';

import { DaoInfoCard } from 'astro_2.0/components/DaoDetails/components/DaoInfoCard';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ActionButton } from 'features/proposal/components/action-button';
import { formatCurrency } from 'utils/formatCurrency';
import * as Typography from 'components/Typography';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import { shortenString } from 'helpers/format';

import styles from './DaoDetailsGrid.module.scss';

export interface DaoDetailsGridProps {
  dao: DAO;
  activeProposals: number;
  totalProposals: number;
  nearPrice: number;
}

export const DaoDetailsGrid: FC<DaoDetailsGridProps> = ({
  dao,
  activeProposals,
  totalProposals,
  nearPrice,
}) => {
  const { t } = useTranslation();
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
  const isMobile = useMedia('(max-width: 920px)');
  const fundsUSD = formatCurrency(parseFloat(funds) * nearPrice);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(url);
  };

  const [measureRef, { width }] = useMeasure<HTMLDivElement>();

  return (
    <div className={styles.root} ref={measureRef}>
      <Link href={`/dao/${id}`}>
        <a className={styles.content}>
          <div>
            <section className={styles.general}>
              <div className={styles.flag}>
                <FlagRenderer flag={flagCover} size="sm" fallBack={oldFlag} />
              </div>
              <div className={styles.title}>
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
                  <div className={styles.addressId}>
                    {shortenString(id, isMobile ? 20 : 36)}
                  </div>
                  <CopyButton
                    text={id}
                    tooltipPlacement="auto"
                    className={styles.copyAddress}
                  />
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
              <DaoInfoCard
                infoType="funds"
                url={`/dao/${id}/treasury/tokens`}
                title={t('daoFunds')}
                daoFunds={fundsUSD}
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
                members={members}
                groups={groups.length}
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
                onClick={e => handleClick(e, `/dao/${id}/tasks/bounties`)}
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
                <span>{activeProposals}</span> {t('active')}{' '}
                {activeProposals === 1 ? t('proposal') : t('proposals')}
              </Typography.Subtitle>
              <Typography.Subtitle
                className={styles.proposalsSubtitle}
                size={6}
              >
                {`${totalProposals} ${t('proposalsInTotal')}`}
              </Typography.Subtitle>
            </section>
          </div>
        </a>
      </Link>
    </div>
  );
};
