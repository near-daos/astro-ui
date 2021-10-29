import React, { FC } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import TextTruncate from 'react-text-truncate';

import { DAO } from 'types/dao';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ActionButton } from 'features/proposal/components/action-button';

import styles from './DaoDetailsMinimized.module.scss';

export interface DaoDetailsMinimizedProps {
  dao: DAO;
  accountId: string | null;
  onCreateProposalClick: () => void;
}

export const DaoDetailsMinimized: FC<DaoDetailsMinimizedProps> = ({
  dao,
  accountId,
  onCreateProposalClick,
}) => {
  const router = useRouter();
  const action = isEmpty(accountId) ? null : (
    <Button
      size="block"
      onClick={onCreateProposalClick}
      className={styles.addProposalButton}
      variant="tertiary"
    >
      <Icon width={24} name="buttonAdd" />
    </Button>
  );

  return (
    <div className={styles.root}>
      <section className={styles.general}>
        <div className={styles.flagWrapper}>
          <svg
            className="svg"
            width="0"
            height="0"
            style={{ position: 'absolute' }}
          >
            <clipPath id="flag-outline">
              <path d="M68.8249 0L14.4555 19.4307V30.2124L0 35.3785V78.0007L54.3694 58.57V47.7883L68.8249 42.6222V0Z" />
            </clipPath>
            <clipPath id="flag">
              <path d="M68.8249 0L14.4555 19.4307V30.2124L0 35.3785V78.0007L54.3694 58.57V47.7883L68.8249 42.6222V0Z" />
            </clipPath>
          </svg>
          <div className={styles.background} />
          <div
            className={styles.cover}
            style={{ backgroundImage: `url(${dao.logo})` }}
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

      <section className={styles.controls}>
        <ActionButton
          tooltip="DAO funds"
          tooltipPlacement="top"
          iconName="funds"
          onClick={() => {
            router.push(`/dao/${dao.id}/treasury/tokens`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="DAO members"
          tooltipPlacement="top"
          iconName="groups"
          onClick={() => {
            router.push(`/dao/${dao.id}/groups/all-members`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="DAO Settings"
          tooltipPlacement="top"
          iconName="settings"
          onClick={() => {
            router.push(`/dao/${dao.id}/governance/settings`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="NFTs"
          tooltipPlacement="top"
          iconName="nfts"
          onClick={() => {
            router.push(`/dao/${dao.id}/treasury/nfts`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="Bounties"
          tooltipPlacement="top"
          iconName="proposalBounty"
          onClick={() => {
            router.push(`/dao/${dao.id}/tasks/bounties`);
          }}
          className={styles.controlIcon}
        />
        <ActionButton
          tooltip="Polls"
          tooltipPlacement="top"
          iconName="proposalPoll"
          onClick={() => {
            router.push(`/dao/${dao.id}/tasks/polls`);
          }}
          className={styles.controlIcon}
        />
      </section>

      <section className={styles.proposals}>{action}</section>
    </div>
  );
};
