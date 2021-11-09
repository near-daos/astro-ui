import React, { FC } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import TextTruncate from 'react-text-truncate';

import { DAO } from 'types/dao';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { ActionButton } from 'features/proposal/components/action-button';
import { FlagRenderer } from 'astro_2.0/components/Flag';

import { useAuthContext } from 'context/AuthContext';

import styles from './DaoDetailsMinimized.module.scss';

export interface DaoDetailsMinimizedProps {
  dao: DAO;
  accountId: string | null;
  onCreateProposalClick?: () => void;
}

export const DaoDetailsMinimized: FC<DaoDetailsMinimizedProps> = ({
  dao,
  onCreateProposalClick,
}) => {
  const router = useRouter();
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
      <section className={styles.general}>
        <div className={styles.flagWrapper}>
          <FlagRenderer flag={dao.flagCover ?? dao.logo} size="sm" />
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

      {onCreateProposalClick && (
        <section className={styles.proposals}>{action}</section>
      )}
    </div>
  );
};
