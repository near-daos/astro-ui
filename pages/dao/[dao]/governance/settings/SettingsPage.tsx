import React, { useCallback } from 'react';
import { NextPage } from 'next';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Badge } from 'components/badge/Badge';
import NavLink from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoSetting } from 'astro_2.0/features/DaoGovernance/components/DaoSetting';
import { SettingsCard } from 'astro_2.0/features/DaoGovernance/components/SettingsCard';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';
import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';

import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';
import { FlagPreview } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreview';

import { getBadgeVariant } from 'features/proposal/helpers';
import { formatYoktoValue } from 'helpers/format';
import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';

import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { useAuthContext } from 'context/AuthContext';
import styles from './SettingsPage.module.scss';

export interface SettingsPageProps {
  dao: DAO;
}

const SettingsPage: NextPage<SettingsPageProps> = ({ dao }) => {
  const { accountId } = useAuthContext();
  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

  const createProposalHandler = useCallback(
    (proposalVariant: ProposalVariant) => () =>
      toggleCreateProposal({ proposalVariant }),
    [toggleCreateProposal]
  );

  const [proposalExp, proposalExpTimeUnit] = nanosToDays(
    dao.policy.proposalPeriod
  );

  const [bountyForgiveness, bountyForgivenessTimeUnit] = nanosToDays(
    dao.policy.bountyForgivenessPeriod
  );

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbsRow}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${dao?.id}`}>
          {dao?.displayName || dao?.id}
        </NavLink>
        <span>DAO settings</span>
      </BreadCrumbs>

      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={() =>
            toggleCreateProposal({
              proposalVariant: ProposalVariant.ProposeChangeBonds,
            })
          }
        />
        <CreateProposal
          className={styles.createProposal}
          dao={dao}
          showFlag={false}
          onCreate={isSuccess => isSuccess && toggleCreateProposal()}
          onClose={toggleCreateProposal}
        />
      </div>

      <div className={styles.titleRow}>DAO settings</div>
      <DaoSetting
        settingsName="Links"
        className={styles.linksRow}
        settingsChangeHandler={createProposalHandler(
          ProposalVariant.ProposeChangeDaoLinks
        )}
      >
        {dao.links.map(link => (
          <div
            className={classNames(styles.container, styles.row, styles.link)}
          >
            <Icon name="socialAnyUrl" className={styles.linkIcon} /> {link}
          </div>
        ))}
        <div className={classNames(styles.rowSeparator)} />
      </DaoSetting>
      <DaoSetting
        settingsName="Bond and deadlines"
        className={styles.bondAndDeadlineRow}
        settingsChangeHandler={createProposalHandler(
          ProposalVariant.ProposeChangeBonds
        )}
      >
        <div className={styles.settingsContainer}>
          <SettingsCard
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
                  <InfoValue value={proposalExp} label={proposalExpTimeUnit} />
                ),
              },
            ]}
          />
          <SettingsCard
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
                  <InfoValue
                    value={bountyForgiveness}
                    label={bountyForgivenessTimeUnit}
                  />
                ),
              },
            ]}
          />
        </div>
        <div className={classNames(styles.rowSeparator)} />
      </DaoSetting>
      <DaoSetting
        settingsName="Voting policy"
        className={styles.votingPolicyRow}
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
          policy={dao.policy.defaultVotePolicy}
          groups={dao.groups}
        />
        <div className={classNames(styles.rowSeparator)} />
      </DaoSetting>
      <DaoSetting
        settingsName="Your Flag and Logo"
        className={styles.flagAndLogoRow}
        settingsChangeHandler={createProposalHandler(
          ProposalVariant.ProposeChangeDaoFlag
        )}
      >
        {dao.flagCover && dao.flagLogo && (
          <FlagPreview logoFile={dao.flagLogo} coverFile={dao.flagCover} />
        )}
      </DaoSetting>
    </div>
  );
};

export default SettingsPage;
