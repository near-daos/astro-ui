import React from 'react';
import { Modal } from 'components/modal';
import { Policies } from 'features/vote-policy/components/policies';
import { DropdownSelect } from 'components/select/DropdownSelect';
import styles from 'features/vote-policy/vote-policy-popup.module.scss';
import { Button } from 'components/button/Button';
import { VotePolicy } from 'features/vote-policy/components/policy-row';
import { Group } from './components/group/Group';

export interface VotePolicyPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  proposers: string[];
  policies: VotePolicy[];
}

export const VotePolicyPopup: React.FC<VotePolicyPopupProps> = ({
  isOpen,
  onClose,
  proposers,
  policies
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <header className={styles.header}>
        <h2>Edit voting policy: Close Bounty</h2>
      </header>
      <div className={styles.content}>
        <div className={styles.proposers}>
          <div className={styles.container}>
            <DropdownSelect
              label="Who can propose"
              options={proposers.map(proposer => ({
                label: proposer,
                component: <Group name={proposer} />
              }))}
            />
          </div>
        </div>

        <Policies
          policies={policies}
          groups={['Members', 'MEW holders', 'Group', 'Ombudspeople']}
          tokens={['NEAR', 'MEW']}
        />

        <div className={styles.footer}>
          <div className={styles.buttons}>
            <Button variant="secondary">Cancel</Button>
            <Button>Save and continue</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
