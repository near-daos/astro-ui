import React, { FC } from 'react';

import { PolicyRowContent } from 'features/vote-policy/components/policy-row-content';
import { Header } from 'features/vote-policy/components/policy-row-header';
import { Collapsable } from 'components/collapsable/Collapsable';

import { DaoVotePolicy, TGroup } from 'types/dao';
import {
  getPoliciesList,
  getProposersList,
  PolicyProps,
  VotingPolicyPageInitialData,
} from 'features/vote-policy/helpers';

import styles from './groups-tab-view.module.scss';

export interface GroupsTabViewProps {
  viewMode?: boolean;
  defaultVotePolicy: DaoVotePolicy;
  groups: TGroup[];
  onChange?: (name: string, value: PolicyProps) => void;
  data: VotingPolicyPageInitialData;
  showTitle?: boolean;
}

export const GroupsTabView: FC<GroupsTabViewProps> = ({
  viewMode = true,
  defaultVotePolicy,
  groups,
  data,
  onChange,
  showTitle = true,
}) => {
  return (
    <div className={styles.root}>
      {showTitle && (
        <p>Create and vote for adding and removing members to/from groups.</p>
      )}
      <div className={styles.content}>
        <Collapsable
          initialOpenState
          renderHeading={(toggle, isOpen) => (
            <Header
              label="Add member to group"
              isOpen={isOpen}
              toggle={toggle}
            />
          )}
        >
          <PolicyRowContent
            onChange={v => onChange?.('addMemberToRole', v)}
            data={data.addMemberToRole as PolicyProps}
            action="Add member to group"
            viewMode={viewMode}
            proposers={getProposersList(
              groups,
              'addMemberToRole',
              'AddProposal'
            )}
            policies={getPoliciesList(
              groups,
              'addMemberToRole',
              ['VoteApprove', 'VoteReject', 'VoteRemove'],
              defaultVotePolicy
            )}
            groups={groups}
          />
        </Collapsable>
        <Collapsable
          initialOpenState
          renderHeading={(toggle, isOpen) => (
            <Header
              label="Remove member from group"
              isOpen={isOpen}
              toggle={toggle}
            />
          )}
        >
          <PolicyRowContent
            onChange={v => onChange?.('removeMemberFromRole', v)}
            data={data.removeMemberFromRole as PolicyProps}
            action="Remove member from group"
            viewMode={viewMode}
            proposers={getProposersList(
              groups,
              'removeMemberFromRole',
              'AddProposal'
            )}
            policies={getPoliciesList(
              groups,
              'removeMemberFromRole',
              ['VoteApprove', 'VoteReject', 'VoteRemove'],
              defaultVotePolicy
            )}
            groups={groups}
          />
        </Collapsable>
      </div>
    </div>
  );
};
