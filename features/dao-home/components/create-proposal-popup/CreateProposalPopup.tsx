import React, { FC } from 'react';

import { Modal } from 'components/modal';
import { Icon, IconName } from 'components/Icon';

import styles from './create-proposal-popup.module.scss';

export interface CreateProposalPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

interface ProposalButtonProps {
  icon: IconName;
  title: string;
  description: string;
}

const ProposalButton: FC<ProposalButtonProps> = ({
  icon,
  title,
  description
}) => (
  <div className={styles.proposal}>
    <div className={styles.left}>
      <Icon name={icon} width={40} />
    </div>
    <div className={styles.right}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  </div>
);

export const CreateProposalPopup: FC<CreateProposalPopupProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <h2>Create proposal</h2>
        <p>This will create a new vote for the members of this DAO.</p>
        <ProposalButton
          icon="proposalRequestPayout"
          title="Request a payout"
          description="Completed a task? Request your payout from DAO."
        />
        <ProposalButton
          icon="proposalClaimBounty"
          title="Claim a bounty"
          description="Sign up here to work on a specific bounty."
        />
      </div>
    </Modal>
  );
};
