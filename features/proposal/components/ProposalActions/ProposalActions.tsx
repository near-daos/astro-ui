import React, { FC } from 'react';

import {
  ProposalType,
  ProposalVariant,
  ProposalVotingPermissions,
} from 'types/proposal';

import { BehaviorActions } from 'features/proposal/components/ProposalActions/components/BehaviorActions';

import { SocialActions } from 'features/proposal/components/ProposalActions/components/SocialActions';

import { Checkbox } from 'components/inputs/Checkbox';

import { MAX_MULTI_VOTES } from 'constants/proposals';

import styles from './ProposalActions.module.scss';

interface ProposalActionsProps {
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  removeCount: number;
  removed: boolean;
  proposalVariant: ProposalVariant;
  proposalType: ProposalType;
  proposalDescription: string;
  permissions?: ProposalVotingPermissions;
  disableControls: boolean;
  daoId: string;
  proposalId: string | undefined;
  onSelect?: (p: string) => void;
  selectedList?: string[];
  allowSelect?: boolean;
}

export const ProposalActions: FC<ProposalActionsProps> = ({
  onSelect,
  onRemove,
  removeCount,
  removed,
  proposalVariant,
  proposalType,
  proposalDescription,
  disableControls,
  daoId,
  proposalId,
  selectedList,
  allowSelect,
}) => {
  const isChecked = selectedList?.findIndex(item => item === proposalId) !== -1;

  return (
    <div className={styles.root}>
      {selectedList && selectedList.length > 0 && allowSelect ? (
        <Checkbox
          disabled={!isChecked && selectedList.length === MAX_MULTI_VOTES}
          className={styles.checkbox}
          checked={isChecked}
          onClick={() =>
            onSelect && proposalId !== undefined && onSelect(proposalId)
          }
        />
      ) : (
        <>
          {!allowSelect ? null : (
            <BehaviorActions
              allowSelect={allowSelect}
              removeCount={removeCount}
              onRemove={onRemove}
              hideSelect={!onSelect}
              onSelect={() =>
                onSelect && proposalId !== undefined && onSelect(proposalId)
              }
              removed={removed}
              disabled={disableControls}
            />
          )}
          <SocialActions
            daoId={daoId}
            proposalDescription={proposalDescription}
            proposalId={proposalId}
            proposalType={proposalType}
            proposalVariant={proposalVariant}
          />
        </>
      )}
    </div>
  );
};
