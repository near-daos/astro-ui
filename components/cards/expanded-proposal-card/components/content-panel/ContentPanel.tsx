import React, { FC, ReactNode } from 'react';

import * as Typography from 'components/Typography';
import ProposalControlPanel from 'components/cards/proposal-card/components/proposal-control-panel/ProposalControlPanel';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import {
  Proposal,
  DaoDetails,
  ProposalType,
  ProposalVotingPermissions,
  ProposalStatus
} from 'types/proposal';
import { VoteDetails } from 'components/vote-details';
import { ProposedChangesRenderer } from 'components/cards/expanded-proposal-card/components/proposed-changes-renderer';
import { DAO } from 'types/dao';
import { getScope } from 'components/cards/expanded-proposal-card/helpers';
import tempFlag from 'stories/dao-home/assets/flag.png';
import { CopyButton } from 'features/copy-button';

import styles from './content-panel.module.scss';

interface ContentPanelProps {
  title: string;
  name: string;
  text: string;
  link: string;
  linkTitle: string;
  children: ReactNode;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  onLike: () => void;
  onDislike: () => void;
  dismisses: number;
  dismissed: boolean;
  daoDetails: DaoDetails;
  type: ProposalType;
  proposalId: number;
  proposalData?: Proposal | null;
  daoData?: DAO | null;
  permissions: ProposalVotingPermissions;
  id?: string;
  daoId: string;
  status?: ProposalStatus;
}

export const ContentPanel: FC<ContentPanelProps> = ({
  daoId,
  title,
  children,
  likes,
  dislikes,
  liked,
  disliked,
  onLike,
  onDislike,
  dismisses,
  dismissed,
  daoDetails,
  type,
  proposalId,
  proposalData,
  daoData,
  permissions
}) => {
  const flag = (tempFlag as StaticImageData).src;

  return (
    <div className={styles.root}>
      <div
        className={styles.content}
        style={{ gridTemplateColumns: proposalData ? '1fr 2fr' : '1fr' }}
      >
        <div>
          <div className={styles.header}>
            <div
              className={styles.flag}
              style={{ backgroundImage: `url(${flag})` }}
            />
            <div className={styles.left}>
              <Typography.Title size={3}>{daoDetails.name}</Typography.Title>
            </div>
            <div className={styles.right}>
              {/* <Icon name="buttonBookmark" className={styles.icon} /> */}
              <CopyButton
                text={document.location.href}
                iconName="buttonShare"
              />
            </div>
          </div>
          <div className={styles.name}>{title}</div>
          <div>{children}</div>
          <ProposalControlPanel
            status={proposalData?.status}
            className={styles.control}
            onLike={onLike}
            onDislike={onDislike}
            likes={likes}
            liked={liked}
            dislikes={dislikes}
            disliked={disliked}
            dismisses={dismisses}
            dismissed={dismissed}
            permissions={permissions}
          />
        </div>
        {proposalData && daoData && (
          <ProposedChangesRenderer dao={daoData} proposal={proposalData} />
        )}
      </div>
      <div className={styles.votes}>
        <ExpandableDetails label="Vote details" className={styles.voteDetails}>
          <VoteDetails
            proposalDaoId={daoId}
            scope={getScope(type)}
            showProgress
            proposalId={proposalId}
          />
        </ExpandableDetails>
      </div>
    </div>
  );
};
