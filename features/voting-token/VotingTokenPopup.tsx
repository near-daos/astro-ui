import React, { FC, useCallback } from 'react';
import { Modal } from 'components/modal';

import { VotingTokenWizard } from 'features/voting-token/components/voting-token-wizard/VotingTokenWizard';

export interface VotingTokenPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const VotingTokenPopup: FC<VotingTokenPopupProps> = ({
  isOpen,
  onClose
}) => {
  const handleSubmit = useCallback(() => {
    // todo - handle submit here
    onClose('submitted');
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <VotingTokenWizard onSubmit={handleSubmit} onClose={onClose} />
    </Modal>
  );
};
