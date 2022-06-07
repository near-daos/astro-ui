// TODO requires localisation

import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { SettingsFilterToggle } from 'astro_2.0/features/DaoGovernance/components/SettingsFilterToggle';
import { DaoSetting, SettingsCard } from 'astro_2.0/features/DaoGovernance';

import { ProposalType, ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';
import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';
import { Badge, getBadgeVariant } from 'components/Badge';
import { PermissionsSelector } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/PermissionsSelector';
import { ManageGroups } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/ManageGroups';
import {
  getInitialCreationPermissions,
  getInitialVotingPermissions,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';

import { formatYoktoValue } from 'utils/format';

import { Icon } from 'components/Icon';

import { Button } from 'components/button/Button';
import styles from './DaoPolicyPageContent.module.scss';

interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const DaoPolicyPageContent: FC<Props> = ({
  daoContext,
  toggleCreateProposal,
}) => {
  const { t } = useTranslation();

  const router = useRouter();
  const { daoFilter } = router.query;
  const { userPermissions, dao } = daoContext;

  const proposalPeriod = nanosToDays(daoContext.dao.policy.proposalPeriod);
  const bountyPeriod = nanosToDays(
    daoContext.dao.policy.bountyForgivenessPeriod
  );

  function handleCreateProposal(
    proposalVariant: ProposalVariant,
    initialValues?: Record<string, unknown>
  ) {
    if (toggleCreateProposal) {
      toggleCreateProposal({ proposalVariant, initialValues });
    }
  }

  return (
    <div className={styles.root}>
      <Button
        variant="transparent"
        className={styles.navigation}
        onClick={() => router.push(router.asPath.split('/policy')[0])}
      >
        <Icon name="buttonArrowLeft" className={styles.navigationIcon} />

        <p className={styles.navigationText}>
          {t('daoPolicy.backToSettingsOverview')}
        </p>
      </Button>

      <div className={styles.titleRow}>{t('daoPolicy.title')}</div>
      <div className={styles.sideFilter}>
        <SettingsFilterToggle variant="daoPolicy" />
      </div>
      <div className={styles.content}>
        {daoFilter === 'proposalCreation' && (
          <PermissionsSelector
            title={t('daoPolicy.tabs.proposalCreation.title')}
            description={t('daoPolicy.tabs.proposalCreation.description')}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangePolicy
              ]
            }
            onSubmit={initialValues => {
              handleCreateProposal(
                ProposalVariant.ProposeChangeProposalCreationPermissions,
                {
                  policy: initialValues,
                }
              );
            }}
            initialData={getInitialCreationPermissions(dao)}
          />
        )}
        {daoFilter === 'votingPermissions' && (
          <PermissionsSelector
            title="Voting permissions"
            description="Choose what voting rights you give DAO groups."
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangePolicy
              ]
            }
            onSubmit={initialValues => {
              handleCreateProposal(
                ProposalVariant.ProposeChangeProposalVotingPermissions,
                {
                  policy: initialValues,
                }
              );
            }}
            initialData={getInitialVotingPermissions(dao)}
          />
        )}
        {daoFilter === 'bondAndDeadlines' && (
          <DaoSetting
            settingsName="Bond and deadlines"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangePolicy
              ]
            }
            settingsChangeHandler={() =>
              handleCreateProposal(ProposalVariant.ProposeChangeBonds)
            }
          >
            <div className={styles.settingsContainer}>
              <SettingsCard
                className={styles.settingsCard}
                settingName="Proposals"
                settings={[
                  {
                    label: 'Bond to create a proposal',
                    value: (
                      <InfoValue
                        value={formatYoktoValue(dao.policy.proposalBond, 24)}
                        label="NEAR"
                      />
                    ),
                  },
                  {
                    label: 'Time before proposal expires',
                    value: (
                      <InfoValue value={proposalPeriod.join(' ')} label="" />
                    ),
                  },
                ]}
              />
              <SettingsCard
                className={styles.settingsCard}
                settingName="Bounties"
                settings={[
                  {
                    label: 'Bond to claim a bounty',
                    value: (
                      <InfoValue
                        value={formatYoktoValue(dao.policy.bountyBond, 24)}
                        label="NEAR"
                      />
                    ),
                  },
                  {
                    label: 'Time to unclaim a bounty without penalty',
                    value: (
                      <InfoValue value={bountyPeriod.join(' ')} label="" />
                    ),
                  },
                ]}
              />
            </div>
          </DaoSetting>
        )}
        {daoFilter === 'votingPolicy' && (
          <DaoSetting
            settingsName="Voting policy"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangePolicy
              ]
            }
            settingsChangeHandler={() =>
              handleCreateProposal(ProposalVariant.ProposeChangeVotingPolicy)
            }
          >
            <div className={styles.groupsWrapper}>
              {dao.groups.map(group => {
                return (
                  <Badge
                    size="small"
                    key={group.slug}
                    variant={getBadgeVariant(group.name)}
                  >
                    {group.name}
                  </Badge>
                );
              })}
            </div>
            <DefaultVotingPolicy
              ratio={dao.policy.defaultVotePolicy.ratio}
              numberOfGroups={dao.groups.length}
            />
          </DaoSetting>
        )}
        {daoFilter === 'groups' && (
          <ManageGroups
            dao={dao}
            handleCreateProposal={handleCreateProposal}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangePolicy
              ]
            }
          />
        )}
      </div>
    </div>
  );
};
