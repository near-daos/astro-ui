import React, { FC } from 'react';
import classNames from 'classnames';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';

import { SettingsFilterToggle } from 'astro_2.0/features/DaoGovernance/components/SettingsFilterToggle';
import { DaoSetting } from 'astro_2.0/features/DaoGovernance';

import { ProposalType, ProposalVariant } from 'types/proposal';
import { DaoContext } from 'types/context';

import { Icon } from 'components/Icon';
import { FlagPreview } from 'astro_2.0/features/CreateDao/components/FlagPreview/FlagPreview';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

import styles from './DaoConfigPageContent.module.scss';

interface Props {
  daoContext: DaoContext;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const DaoConfigPageContent: FC<Props> = ({
  daoContext,
  toggleCreateProposal,
}) => {
  const router = useRouter();
  const { daoFilter } = router.query;
  const { userPermissions, dao } = daoContext;

  function handleCreateProposal(proposalVariant: ProposalVariant) {
    if (toggleCreateProposal) {
      toggleCreateProposal({ proposalVariant });
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>DAO Settings</div>
      <div className={styles.sideFilter}>
        <SettingsFilterToggle variant="daoConfig" />
      </div>
      <div className={styles.content}>
        {daoFilter === 'nameAndPurpose' && (
          <DaoSetting
            settingsName="DAO Name and Purpose"
            className={styles.contentRow}
            disableNewProposal={
              !userPermissions.isCanCreateProposals ||
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangeConfig
              ]
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
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangeConfig
              ]
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
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangeConfig
              ]
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
              !userPermissions.isCanCreatePolicyProposals ||
              !userPermissions.allowedProposalsToCreate[
                ProposalType.ChangeConfig
              ]
            }
            settingsChangeHandler={() =>
              handleCreateProposal(ProposalVariant.ProposeChangeDaoFlag)
            }
          >
            <FlagPreview logoFile={dao.flagLogo} coverFile={dao.flagCover} />
          </DaoSetting>
        )}
      </div>
    </div>
  );
};
