import React, { useCallback, useState, useMemo } from 'react';
import omit from 'lodash/omit';
import { ModalType, ModalContext } from './ModalContext';

export interface ModalProviderProps {
  container?: Element;
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  container,
  children,
}: ModalProviderProps) => {
  if (container && !(container instanceof HTMLElement)) {
    throw new Error(`Container must be a DOM element.`);
  }

  const [modals, setModals] = useState<Record<string, ModalType>>({});

  const showModal = useCallback(
    (id: string, modal: ModalType) => {
      setModals({ ...modals, [id]: modal });
    },
    [modals]
  );

  const hideModal = useCallback(
    (id: string) => {
      setModals(omit(modals, [id]));
    },
    [modals]
  );

  const contextValue = useMemo(
    () => ({ showModal, hideModal }),
    [hideModal, showModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      <>
        {children}
        {Object.values(modals)}
      </>
    </ModalContext.Provider>
  );
};
