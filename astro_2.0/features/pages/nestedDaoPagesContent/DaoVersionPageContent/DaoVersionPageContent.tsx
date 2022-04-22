import React, { FC, useMemo } from 'react';
import { format, parseISO } from 'date-fns';

import {
  useCheckDaoUpgrade,
  useUpgradeStatus,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent/hooks';
import { UpgradeVersionWizard } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent/components/UpgradeVersionWizard';

import { UpgradeSteps } from 'types/settings';
import { DaoContext } from 'types/context';
import { ProposalType } from 'types/proposal';

import { VersionCheck } from './components/VersionCheck';

import styles from './DaoVersionPageContent.module.scss';

interface DaoVersionPageContentProps {
  daoContext: DaoContext;
}

export const DaoVersionPageContent: FC<DaoVersionPageContentProps> = ({
  daoContext,
}) => {
  const { versionHash } = useCheckDaoUpgrade(daoContext.dao);
  const { loading, upgradeStatus, update } = useUpgradeStatus(
    daoContext.dao.id
  );
  const isViewProposal = upgradeStatus?.proposalId !== null;
  const isUpgradeInProgress =
    upgradeStatus && upgradeStatus.upgradeStep !== null;
  const isUpgradeAvailable =
    versionHash &&
    daoContext.userPermissions.isCanCreateProposals &&
    daoContext.userPermissions.allowedProposalsToCreate[
      ProposalType.UpgradeSelf
    ];

  const versionDetails = useMemo(() => {
    const { daoVersion } = daoContext.dao;

    if (!daoVersion) {
      return null;
    }

    return {
      date: format(parseISO(daoVersion.createdAt), 'dd MMM yyyy, hh:mm aaa'),
      number: daoVersion.version.join('.'),
    };
  }, [daoContext.dao]);

  if (!daoContext.userPermissions.isCanCreateProposals && !isViewProposal) {
    return <div>no permissions</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>
        <h1>DAO Settings</h1>
      </div>
      {isUpgradeInProgress && upgradeStatus ? (
        <UpgradeVersionWizard
          daoContext={daoContext}
          upgradeStatus={upgradeStatus}
          versionHash={versionHash ?? ''}
          onUpdate={update}
        />
      ) : (
        <VersionCheck
          handleUpdate={async () => {
            await update({
              upgradeStep: UpgradeSteps.GetUpgradeCode,
              proposalId: null,
              versionHash: versionHash ?? '',
            });
          }}
          disabled={!isUpgradeAvailable}
          className={styles.versionCheck}
          version={versionDetails}
          loading={loading}
        />
      )}
    </div>
  );
};
