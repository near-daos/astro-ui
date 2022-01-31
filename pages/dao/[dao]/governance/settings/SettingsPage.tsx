import React, { useCallback } from 'react';
import { NextPage } from 'next';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import TextTruncate from 'react-text-truncate';

import { ALL_DAOS_URL } from 'constants/routing';

import { Icon } from 'components/Icon';
import { Badge } from 'components/badge/Badge';
import { NavLink } from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoSetting } from 'astro_2.0/features/DaoGovernance/components/DaoSetting';
import { SettingsCard } from 'astro_2.0/features/DaoGovernance/components/SettingsCard';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';
import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { FlagPreview } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreview';
import { SettingsFilterToggle } from 'astro_2.0/features/DaoGovernance/components/SettingsFilterToggle';
import { getBadgeVariant } from 'features/proposal/helpers';
import { formatYoktoValue } from 'utils/format';
import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';
import { useDaoCustomTokens } from 'hooks/useCustomTokens';

import { ProposalVariant } from 'types/proposal';

import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { DaoContext } from 'types/context';
import styles from './SettingsPage.module.scss';

export interface SettingsPageProps {
  daoContext: DaoContext;
}

const SettingsPage: NextPage<SettingsPageProps> = ({
  daoContext: { dao, policyAffectsProposals, userPermissions },
}) => {
  const router = useRouter();
  const { daoFilter } = router.query;
  const { tokens } = useDaoCustomTokens();
  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  const createProposalHandler = useCallback(
    (proposalVariant: ProposalVariant) => () =>
      toggleCreateProposal({ proposalVariant }),
    [toggleCreateProposal]
  );

  const proposalPeriod = nanosToDays(dao.policy.proposalPeriod);
  const bountyPeriod = nanosToDays(dao.policy.bountyForgivenessPeriod);

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbsRow}>
        <NavLink href={ALL_DAOS_URL}>All DAOs</NavLink>
        <NavLink href={`/dao/${dao?.id}`}>
          {dao?.displayName || dao?.id}
        </NavLink>
        <span>DAO settings</span>
      </BreadCrumbs>

      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          userPermissions={userPermissions}
          onCreateProposalClick={() =>
            toggleCreateProposal({
              proposalVariant: ProposalVariant.ProposeChangeBonds,
            })
          }
        />
        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          userPermissions={userPermissions}
          key={Object.keys(tokens).length}
          daoTokens={tokens}
          showFlag={false}
          onClose={toggleCreateProposal}
        />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
      </div>

      <div className={styles.titleRow}>DAO settings</div>

      <div className={styles.sideFilter}>
        <SettingsFilterToggle />
      </div>

      <div className={styles.content}>
        {daoFilter === 'nameAndPurpose' && (
          <DaoSetting
            settingsName="Name and Purpose"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals
            }
            settingsChangeHandler={createProposalHandler(
              ProposalVariant.ProposeChangeDaoLegalInfo
            )}
          >
            <div className={styles.row}>
              <div className={styles.label}>DAO name:</div>
              <div className={styles.daoName}>{dao.displayName ?? dao.id}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>Purpose:</div>
              <div className={styles.daoPurpose}>{dao.description}</div>
            </div>
          </DaoSetting>
        )}
        {daoFilter === 'legalStatusAndDoc' && (
          <DaoSetting
            settingsName="Legal Status and doc"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals
            }
            settingsChangeHandler={createProposalHandler(
              ProposalVariant.ProposeChangeDaoLegalInfo
            )}
          >
            <a
              href={dao.legal?.legalLink ?? ''}
              target="_blank"
              rel="noreferrer"
              className={styles.legalLink}
            >
              {dao.legal?.legalStatus || 'Public Limited Company'}
              <Icon
                name="buttonExternal"
                width={14}
                className={styles.legalIcon}
              />
            </a>
          </DaoSetting>
        )}
        {daoFilter === 'links' && (
          <DaoSetting
            settingsName="Links"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals
            }
            settingsChangeHandler={createProposalHandler(
              ProposalVariant.ProposeChangeDaoLinks
            )}
          >
            {dao.links.map(link => (
              <div
                key={link}
                className={classNames(
                  styles.container,
                  styles.row,
                  styles.link
                )}
              >
                <Icon name="socialAnyUrl" className={styles.linkIcon} />
                <TextTruncate
                  line={1}
                  element="div"
                  containerClassName={styles.linkText}
                  truncateText="…"
                  text={link}
                  textTruncateChild={null}
                />
              </div>
            ))}
          </DaoSetting>
        )}
        {daoFilter === 'flagAndLogo' && (
          <DaoSetting
            settingsName="Your Flag and Logo"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals
            }
            settingsChangeHandler={createProposalHandler(
              ProposalVariant.ProposeChangeDaoFlag
            )}
          >
            {dao.flagCover && dao.flagLogo && (
              <FlagPreview logoFile={dao.flagLogo} coverFile={dao.flagCover} />
            )}
          </DaoSetting>
        )}
        {daoFilter === 'bondAndDeadlines' && (
          <DaoSetting
            settingsName="Bond and deadlines"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals
            }
            settingsChangeHandler={createProposalHandler(
              ProposalVariant.ProposeChangeBonds
            )}
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
              !userPermissions.isCanCreatePolicyProposals
            }
            settingsChangeHandler={createProposalHandler(
              ProposalVariant.ProposeChangeVotingPolicy
            )}
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
      </div>
    </div>
  );
};

export default SettingsPage;
