import React, { FC } from 'react';

import { AccordeonContent } from 'features/vote-policy/components/accordeon-content';
import { AccordeonRow } from 'features/vote-policy/components/accordeon-row';

import { DaoVotePolicy, TGroup } from 'types/dao';
import {
  getPoliciesList,
  getProposersList,
  PolicyProps,
  VotingPolicyPageInitialData
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
  showTitle
}) => {
  const items = [
    {
      id: '1',
      label: 'Add member to group',
      content: (
        <AccordeonContent
          onChange={v => onChange?.('addMemberToRole', v)}
          data={data.addMemberToRole as PolicyProps}
          action="Add member to group"
          viewMode={viewMode}
          proposers={getProposersList(groups, 'addMemberToRole', 'AddProposal')}
          policies={getPoliciesList(
            groups,
            'addMemberToRole',
            ['VoteApprove', 'VoteReject', 'VoteRemove'],
            defaultVotePolicy
          )}
        />
      )
    },
    {
      id: '2',
      label: 'Remove member from group',
      content: (
        <AccordeonContent
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
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      {showTitle && (
        <p>Create and vote for adding and removing members to/from groups.</p>
      )}
      <div className={styles.content}>
        <AccordeonRow items={items} />
      </div>
    </div>
  );
};
