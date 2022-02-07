import React, { FC } from 'react';
import classNames from 'classnames';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';

import { SettingsFilterToggle } from 'astro_2.0/features/DaoGovernance/components/SettingsFilterToggle';
import { DaoSetting, SettingsCard } from 'astro_2.0/features/DaoGovernance';

import { ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { Icon } from 'components/Icon';
import { FlagPreview } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreview';
import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';
import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';
import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';
import { Badge } from 'components/badge/Badge';

import { getBadgeVariant } from 'features/proposal/helpers';

import { formatYoktoValue } from 'utils/format';

import styles from './SettingsPageContent.module.scss';

export interface SettingsPageContentProps {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const SettingsPageContent: FC<SettingsPageContentProps> = ({
  daoContext,
  toggleCreateProposal,
}) => {
  const router = useRouter();
  const { daoFilter } = router.query;
  const { userPermissions, dao } = daoContext;

  const proposalPeriod = nanosToDays(daoContext.dao.policy.proposalPeriod);
  const bountyPeriod = nanosToDays(
    daoContext.dao.policy.bountyForgivenessPeriod
  );

  function handleCreateProposal(proposalVariant: ProposalVariant) {
    if (toggleCreateProposal) {
      toggleCreateProposal({ proposalVariant });
    }
  }

  return (
    <div className={styles.root}>
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
            settingsChangeHandler={() =>
              handleCreateProposal(ProposalVariant.ProposeChangeDaoName)
            }
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
            settingsChangeHandler={() =>
              handleCreateProposal(ProposalVariant.ProposeChangeDaoLegalInfo)
            }
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
            settingsChangeHandler={() =>
              handleCreateProposal(ProposalVariant.ProposeChangeDaoLinks)
            }
          >
            {dao.links.map((link: string) => (
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
            settingsChangeHandler={() =>
              handleCreateProposal(ProposalVariant.ProposeChangeDaoFlag)
            }
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
              !userPermissions.isCanCreatePolicyProposals
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
      </div>
    </div>
  );
};
