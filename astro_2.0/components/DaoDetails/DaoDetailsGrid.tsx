import React, { FC } from 'react';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';

import { DAO } from 'types/dao';

import { DaoInfoCard } from 'astro_2.0/components/DaoDetails/components/DaoInfoCard';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ActionButton } from 'features/proposal/components/action-button';
import { formatCurrency } from 'utils/formatCurrency';
import * as Typography from 'components/Typography';
import { FlagRenderer } from 'astro_2.0/components/Flag';

import cn from 'classnames';
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
  const fundsUSD = formatCurrency(parseFloat(funds) * nearPrice);

  return (
    <div className={styles.root}>
      <Link href={`/dao/${id}`}>
        <a className={styles.content}>
          <div>
            <section className={styles.general}>
              <div className={styles.flag}>
                <FlagRenderer flag={flagCover} size="sm" fallBack={oldFlag} />
              </div>
              <div className={styles.title}>
                <div className={styles.name}>
                  <div className={styles.displayName}>{displayName || id}</div>
                </div>
                <div className={styles.address}>
                  <CopyButton
                    title={id}
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
                title="DAO funds"
                daoFunds={fundsUSD}
                tooltip="DAO funds"
              />
              <DaoInfoCard
                infoType="members"
                url={`/dao/${id}/groups/all-members`}
                title="Members/Groups"
                members={members}
                groups={groups.length}
                tooltip="DAO members"
              />
            </section>

            <section className={styles.controls}>
              <ActionButton
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/dao/${id}/governance/settings`);
                }}
                className={styles.controlIcon}
                iconName="settings"
                tooltip="DAO Settings"
                tooltipPlacement="top"
              />
              <ActionButton
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/dao/${id}/treasury/nfts`);
                }}
                className={styles.controlIcon}
                iconName="nfts"
                tooltip="NFTs"
                tooltipPlacement="top"
              />
              <ActionButton
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/dao/${id}/tasks/bounties`);
                }}
                className={styles.controlIcon}
                iconName="proposalBounty"
                tooltip="Bounties"
                tooltipPlacement="top"
              />
              <ActionButton
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/dao/${id}/tasks/polls`);
                }}
                className={styles.controlIcon}
                iconName="proposalPoll"
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
              <Typography.Subtitle
                className={styles.proposalsSubtitle}
                size={6}
              >
                {`${totalProposals} proposals in total`}
              </Typography.Subtitle>
            </section>
          </div>
        </a>
      </Link>
    </div>
  );
};
