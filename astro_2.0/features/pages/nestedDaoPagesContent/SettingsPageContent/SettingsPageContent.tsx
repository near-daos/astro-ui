import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { DaoContext } from 'types/context';

import { DaoSettingFlowButton } from 'astro_2.0/features/DaoGovernance/components/DaoSettingFlowButton';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

import { DAO_CONFIG_PAGE_URL, DAO_POLICY_PAGE_URL } from 'constants/routing';

import styles from './SettingsPageContent.module.scss';

export interface SettingsPageContentProps {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const SettingsPageContent: FC<SettingsPageContentProps> = ({
  daoContext,
}) => {
  const router = useRouter();
  const { dao } = daoContext;

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>DAO settings</div>
      <div className={styles.content}>
        <DaoSettingFlowButton
          onClick={() =>
            router.push({
              pathname: DAO_CONFIG_PAGE_URL,
              query: {
                dao: dao.id,
                daoFilter: 'nameAndPurpose',
              },
            })
          }
          icon="navSettingsConfig"
          label="Configuration settings"
        />
        <DaoSettingFlowButton
          onClick={() =>
            router.push({
              pathname: DAO_POLICY_PAGE_URL,
              query: {
                dao: dao.id,
                daoFilter: 'proposalCreation',
              },
            })
          }
          icon="navSettingsPolicy"
          label="Policy settings"
        />
        <DaoSettingFlowButton
          onClick={() => router.push('')}
          icon="navSettingsVersion"
          label="Version update"
        />
      </div>
    </div>
  );
};
