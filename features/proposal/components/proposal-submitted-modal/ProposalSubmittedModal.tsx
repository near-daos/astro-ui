import { Button } from 'components/button/Button';
import { Modal } from 'components/modal';
import styles from 'features/create-dao/components/settings-modal/dao-settings-modal.module.scss';
import { ProposalSubmittedIllustration } from 'features/proposal/components/proposal-submitted-modal/illustration';
import React, { VFC } from 'react';

export interface ProposalSubmittedModalProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const ProposalSubmittedModal: VFC<ProposalSubmittedModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <ProposalSubmittedIllustration />
        <section>
          <h2> Your proposal was added! </h2>
          <p>Others can vote on it now. </p>
        </section>

        <Button onClick={() => onClose()}> Cool! </Button>
      </div>
    </Modal>
  );
};
