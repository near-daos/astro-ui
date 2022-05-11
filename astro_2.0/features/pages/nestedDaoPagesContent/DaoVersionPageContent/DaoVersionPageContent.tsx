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
  const { version } = useCheckDaoUpgrade(daoContext.dao);
  const { loading, upgradeStatus, update } = useUpgradeStatus(
    daoContext.dao.id
  );
  const isViewProposal = upgradeStatus?.proposalId !== null;
  const isUpgradeInProgress =
    upgradeStatus && upgradeStatus.upgradeStep !== null;
  const isUpgradeAvailable =
    version &&
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
      current: {
        date: format(parseISO(daoVersion.createdAt), 'dd MMM yyyy, hh:mm aaa'),
        number: daoVersion.version.join('.'),
      },
      next: {
        number: version ? version[1].version.join('.') : '',
      },
    };
  }, [daoContext.dao, version]);

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
          versionHash={version ? version[0] : ''}
          onUpdate={update}
        />
      ) : (
        <VersionCheck
          handleUpdate={async () => {
            await update({
              upgradeStep: UpgradeSteps.GetUpgradeCode,
              proposalId: null,
              versionHash: version ? version[0] : '',
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
