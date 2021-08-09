import React, { useCallback, useState, useMemo } from 'react';
import { ModalType, ModalContext } from './ModalContext';

export interface ModalProviderProps {
  container?: Element;
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  container,
  children
}: ModalProviderProps) => {
  if (container && !(container instanceof HTMLElement)) {
    throw new Error(`Container must be a DOM element.`);
  }

  const [currentModal, setCurrentModal] = useState<ModalType | null>(null);

  const showModal = useCallback(
    (modal: ModalType) => setCurrentModal(modal),
    []
  );

  const hideModal = useCallback(() => setCurrentModal(null), []);

  const contextValue = useMemo(() => ({ showModal, hideModal }), [
    hideModal,
    showModal
  ]);

  return (
    <ModalContext.Provider value={contextValue}>
      <>
        {children}
        {currentModal}
      </>
    </ModalContext.Provider>
  );
};
