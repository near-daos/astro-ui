import React, { FC, useCallback, useEffect, useState } from 'react';

import { DaoContext } from 'types/context';
import { CreationProgress } from 'astro_2.0/components/CreationProgress';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import { useDaoUpgrade } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent/useDaoUpgrade';
import { VersionCheck } from './components/VersionCheck';

import styles from './DaoVersionPageContent.module.scss';

interface DaoVersionPageContentProps {
  daoContext: DaoContext;
}

export const DaoVersionPageContent: FC<DaoVersionPageContentProps> = ({
  daoContext,
}) => {
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);

  const { currentProposalVariant, upgradeSteps, upgradeStatus } = useDaoUpgrade(
    daoContext.dao
  );

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleVersionCheck = useCallback(() => {
    setShowWizard(true);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>DAO Settings</div>
      {showWizard ? (
        <>
          <div className={styles.steps}>
            <CreationProgress steps={upgradeSteps} />
          </div>
          <div className={styles.content}>
            <CreateProposal
              {...daoContext}
              // todo replace with actual implementation, save to backend
              onCreate={() => null}
              redirectAfterCreation={false}
              onClose={() => null}
              daoTokens={{}}
              showFlag={false}
              showClose={false}
              showInfo={false}
              proposalVariant={currentProposalVariant}
              initialValues={{ versionHash: upgradeStatus?.versionHash }}
            />
          </div>
        </>
      ) : (
        <VersionCheck
          handleUpdate={handleVersionCheck}
          className={styles.versionCheck}
          version={{ date: '12.03.21', number: '12.3456.14' }}
          loading={loading}
        />
      )}
    </div>
  );
};
