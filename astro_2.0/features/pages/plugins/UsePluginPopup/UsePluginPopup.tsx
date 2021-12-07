import React, { FC, useCallback } from 'react';

import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';

import { IWizardInitialData } from './types';

import { UsePluginWizard } from './components/UsePluginWizard';

import styles from './UsePluginPopup.module.scss';

export interface UsePluginPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  initialData: IWizardInitialData;
}

export const UsePluginPopup: FC<UsePluginPopupProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const handleSubmit = useCallback(() => {
    // todo - handle create bounty here
    onClose('submitted');
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon name="proposalNearFunctionCall" width={24} />
        <h2>Use a plugin</h2>
      </header>
      <UsePluginWizard
        onSubmit={handleSubmit}
        onClose={onClose}
        initialData={initialData}
      />
    </Modal>
  );
};
