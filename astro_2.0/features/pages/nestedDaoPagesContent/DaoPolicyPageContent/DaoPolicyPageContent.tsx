import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

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
import { DraftSettings } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/DraftSettings';

import { useDaoSettings } from 'context/DaoSettingsContext';

import { CREATE_PROPOSAL_FORM } from 'constants/common';

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
  const { settings } = useDaoSettings();

  const proposalPeriod = nanosToDays(daoContext.dao.policy.proposalPeriod);
  const bountyPeriod = nanosToDays(
    daoContext.dao.policy.bountyForgivenessPeriod
  );

  function handleCreateProposal(
    proposalVariant: ProposalVariant,
    initialValues?: Record<string, unknown>
  ) {
    if (toggleCreateProposal) {
      const isCreateProposalFormOpen =
        localStorage.getItem(CREATE_PROPOSAL_FORM) === '1';

      if (isCreateProposalFormOpen) {
        toggleCreateProposal();
      }

      Promise.resolve().then(() =>
        toggleCreateProposal({ proposalVariant, initialValues })
      );
    }
  }

  return (
    <div className={styles.root}>
      <Head>
        <title>Astro - DAO Policy {daoFilter ? `- ${daoFilter}` : ''}</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1" />
      </Head>
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
            title={t('daoPolicy.tabs.votingPermissions.title')}
            description={t('daoPolicy.tabs.votingPermissions.description')}
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
            settingsName={t('daoPolicy.bondAndDeadlines')}
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
                settingName={t('daoPolicy.settings.proposals.title')}
                settings={[
                  {
                    label: t(
                      'daoPolicy.settings.proposals.bondToCreateProposal'
                    ),
                    value: (
                      <InfoValue
                        value={formatYoktoValue(dao.policy.proposalBond, 24)}
                        label="NEAR"
                      />
                    ),
                  },
                  {
                    label: t(
                      'daoPolicy.settings.proposals.timeBeforeProposalExpires'
                    ),
                    value: (
                      <InfoValue value={proposalPeriod.join(' ')} label="" />
                    ),
                  },
                ]}
              />
              <SettingsCard
                className={styles.settingsCard}
                settingName={t('daoPolicy.settings.bounties.title')}
                settings={[
                  {
                    label: t('daoPolicy.settings.bounties.bondToClaimABounty'),
                    value: (
                      <InfoValue
                        value={formatYoktoValue(dao.policy.bountyBond, 24)}
                        label="NEAR"
                      />
                    ),
                  },
                  {
                    label: t('daoPolicy.settings.bounties.timeToUnclaimBounty'),
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
            settingsName={t('daoPolicy.settings.daoSettings.title')}
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
        {daoFilter === 'drafts' && settings && <DraftSettings dao={dao} />}
      </div>
    </div>
  );
};
