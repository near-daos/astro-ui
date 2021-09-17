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

import styles from './governance-tab-view.module.scss';

export interface GovernanceTabViewProps {
  viewMode?: boolean;
  defaultVotePolicy: DaoVotePolicy;
  groups: TGroup[];
  onChange?: (name: string, value: PolicyProps) => void;
  data: VotingPolicyPageInitialData;
  showTitle?: boolean;
}

export const GovernanceTabView: FC<GovernanceTabViewProps> = ({
  viewMode = true,
  defaultVotePolicy,
  groups,
  data,
  onChange,
  showTitle = true
}) => {
  const items = [
    // {
    //   id: '1',
    //   label: 'Upgrade self',
    //   content: (
    //     <AccordeonContent
    //       onChange={v => onChange('upgradeSelf', v)}
    //       data={data.upgradeSelf as PolicyProps}
    //       action="Upgrade self"
    //       viewMode={viewMode}
    //       proposers={getProposersList(groups, 'upgradeSelf', 'AddProposal')}
    //       policies={getPoliciesList(
    //         groups,
    //         'upgradeSelf',
    //         ['VoteApprove', 'VoteReject', 'VoteRemove'],
    //         defaultVotePolicy
    //       )}
    //     />
    //   )
    // },
    // {
    //   id: '2',
    //   label: 'Upgrade remote',
    //   content: (
    //     <AccordeonContent
    //       onChange={v => onChange('upgradeRemote', v)}
    //       data={data.upgradeSelf as PolicyProps}
    //       action="Upgrade remote"
    //       viewMode={viewMode}
    //       proposers={getProposersList(groups, 'upgradeRemote', 'AddProposal')}
    //       policies={getPoliciesList(
    //         groups,
    //         'upgradeRemote',
    //         ['VoteApprove', 'VoteReject', 'VoteRemove'],
    //         defaultVotePolicy
    //       )}
    //     />
    //   )
    // },
    {
      id: '3',
      label: 'Config',
      content: (
        <AccordeonContent
          onChange={v => onChange?.('config', v)}
          data={data.config as PolicyProps}
          action="Create poll"
          viewMode={viewMode}
          proposers={getProposersList(groups, 'config', 'AddProposal')}
          policies={getPoliciesList(
            groups,
            'config',
            ['VoteApprove', 'VoteReject', 'VoteRemove'],
            defaultVotePolicy
          )}
        />
      )
    }
  ];

  return (
    <div className={styles.root}>
      {showTitle && <p>Create and vote on update configuration proposals.</p>}
      <div className={styles.content}>
        <AccordeonRow items={items} />
      </div>
    </div>
  );
};
