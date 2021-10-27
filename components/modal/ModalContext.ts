import React from 'react';

export interface IModal {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: (...args: any[]) => void;
}

export type ModalType = React.FunctionComponentElement<IModal>;

export interface ModalContextType {
  showModal(id: string, component: ModalType): void;
  hideModal(id: string): void;
}

const outsideOfProvider = (): Error => {
  throw new Error('Please make sure your app is wrapped with ModalProvider.');
};

/**
 * Modal Context Object
 */
export const ModalContext = React.createContext<ModalContextType>({
  showModal: outsideOfProvider,
  hideModal: outsideOfProvider,
});
