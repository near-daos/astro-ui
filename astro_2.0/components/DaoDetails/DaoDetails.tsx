import React, { FC } from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { DAO } from 'types/dao';

import { ProposalTrackerCard } from 'astro_2.0/components/DaoDetails/components/ProposalTrackerCard';
import { DaoGeneralCard } from 'astro_2.0/components/DaoDetails/components/DaoGeneralCard';
import { ActionButton } from 'features/proposal/components/action-button';
import { isUserPermittedToCreateProposal } from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { getAccumulatedTokenValue } from 'features/treasury/helpers';
import { Token } from 'types/token';

import styles from './DaoDetails.module.scss';

export interface DaoDetailsProps {
  className?: string;
  dao: DAO;
  accountId?: string | null;
  onCreateProposalClick?: (dao: DAO) => void;
  activeProposals: number;
  totalProposals: number;
  restrictCreateProposals?: boolean;
  daoTokens: Record<string, Token>;
}

export const DaoDetails: FC<DaoDetailsProps> = ({
  dao,
  className,
  daoTokens,
  accountId,
  onCreateProposalClick,
  activeProposals,
  totalProposals,
  restrictCreateProposals = false,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const isCreateOptionAvailable = isUserPermittedToCreateProposal(
    accountId,
    dao
  );

  const action =
    !isCreateOptionAvailable ||
    restrictCreateProposals ||
    isEmpty(accountId) ? null : (
      <>Create proposal</>
    );

  function getFundsInUsdFromNear() {
    const total = getAccumulatedTokenValue(daoTokens);

    return total.toFixed(2);
  }

  return (
    <div className={cn(styles.root, className)}>
      <section className={styles.general}>
        <DaoGeneralCard
          displayName={dao.displayName}
          id={dao.id}
          description={dao.description}
          links={dao.links}
          flag={dao.logo}
          cover={dao.flagCover}
          logo={dao.flagLogo}
          legal={dao.legal}
        />
      </section>

      <section className={styles.funds}>
        <Link href={`/dao/${dao.id}/treasury/tokens`}>
          <a>
            <div className={styles.label}>{t('daoFunds')}</div>
            <div className={styles.value}>
              <span className={styles.bold}>{getFundsInUsdFromNear()}</span> USD
            </div>
          </a>
        </Link>
      </section>

      <section className={styles.members}>
        <Link href={`/dao/${dao.id}/groups/all-members`}>
          <a>
            <div className={styles.label}>{t('membersGroups')}</div>
            <div className={styles.value}>
              <span className={styles.bold}>{dao.members}</span>/
              {dao.groups.length}
            </div>
          </a>
        </Link>
      </section>

      <section className={styles.controls}>
        <ActionButton
          tooltip={t('daoSettings')}
          tooltipPlacement="top"
          iconName="settings"
          onClick={() => {
            router.push(`/dao/${dao.id}/governance/settings`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip={t('nfts')}
          tooltipPlacement="top"
          iconName="nfts"
          onClick={() => {
            router.push(`/dao/${dao.id}/treasury/nfts`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip={t('bounties')}
          tooltipPlacement="top"
          iconName="proposalBounty"
          onClick={() => {
            router.push(`/dao/${dao.id}/tasks/bounties`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip={t('polls')}
          tooltipPlacement="top"
          iconName="proposalPoll"
          onClick={() => {
            router.push(`/dao/${dao.id}/tasks/polls`);
          }}
          className={styles.controlIcon}
        />
      </section>

      <section className={styles.proposals}>
        <ProposalTrackerCard
          activeVotes={activeProposals}
          totalProposals={totalProposals}
          action={action}
          onClick={() => onCreateProposalClick?.(dao)}
        />
      </section>
    </div>
  );
};
