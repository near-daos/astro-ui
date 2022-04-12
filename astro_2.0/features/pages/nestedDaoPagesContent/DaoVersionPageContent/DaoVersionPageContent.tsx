import React, { FC, useCallback, useEffect, useState } from 'react';

import { DaoContext } from 'types/context';
import { CreationProgress } from 'astro_2.0/components/CreationProgress';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';

import { VersionCheck } from './components/VersionCheck';

import styles from './DaoVersionPageContent.module.scss';

interface DaoVersionPageContentProps {
  daoContext: DaoContext;
}

const steps = [
  {
    label: 'Get latest code',
    value: 'getLatestCode',
    isCurrent: true,
  },
  {
    label: 'Upgrade self',
    value: 'upgradeSelf',
  },
  {
    label: 'Remove upgrade code blob',
    value: 'removeUpgradeCodeBlob',
  },
];

export const DaoVersionPageContent: FC<DaoVersionPageContentProps> = ({
  daoContext,
}) => {
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);

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
            <CreationProgress steps={steps} />
          </div>
          <div className={styles.content}>
            <CreateProposal
              {...daoContext}
              onClose={() => null}
              daoTokens={{}}
              showFlag={false}
              showClose={false}
              showInfo={false}
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
