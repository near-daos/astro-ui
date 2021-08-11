import React, { FC, useCallback } from 'react';

import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';

import UsePluginWizard from 'features/plugins/components/use-plugin-popup/components/use-plugin-wizard/UsePluginWizard';

import { IWizardInitialData } from 'features/plugins/components/use-plugin-popup/types';

import styles from './use-plugin-popup.module.scss';

export interface UsePluginPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  initialData: IWizardInitialData;
}

export const UsePluginPopup: FC<UsePluginPopupProps> = ({
  isOpen,
  onClose,
  initialData
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
