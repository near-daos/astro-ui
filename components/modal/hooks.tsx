import { FunctionComponent, useContext } from 'react';
import { ModalContext, IModal } from './ModalContext';

type OnCloseParameters<T extends IModal> = Parameters<T['onClose']>;

type UseModalResult<T extends IModal> = [
  (props?: Partial<T>) => Promise<OnCloseParameters<T>>,
  () => void
];

export const useModal = <P extends IModal>(
  Component: FunctionComponent<P>,
  initialProps?: Partial<P>
): UseModalResult<P> => {
  const context = useContext(ModalContext);

  const hideModal = () => {
    context.hideModal();
  };

  const showModal = (modalProps: Partial<P> = {}) => {
    return new Promise<OnCloseParameters<P>>(resolve => {
      const props = {
        ...initialProps,
        ...modalProps
      };

      const onCloseModal = (...args: OnCloseParameters<P>) => {
        context.hideModal();

        props.onClose?.(...args);
        resolve(args);
      };

      const modal = (
        <Component {...(props as P)} isOpen onClose={onCloseModal} />
      );

      context.showModal(modal);
    });
  };

  return [showModal, hideModal];
};

export default useModal;
