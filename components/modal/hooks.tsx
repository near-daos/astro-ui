import { FunctionComponent, useContext } from 'react';
import { nanoid } from 'nanoid';
import { ModalContext, IModal } from './ModalContext';

type OnCloseParameters<T extends IModal> = Parameters<T['onClose']>;

type UseModalResult<T extends IModal> = [
  (props?: Partial<T>) => Promise<OnCloseParameters<T>>
];

export const useModal = <P extends IModal>(
  Component: FunctionComponent<P>,
  initialProps?: Partial<P>
): UseModalResult<P> => {
  const context = useContext(ModalContext);

  const showModal = (modalProps: Partial<P> = {}) => {
    const id = nanoid();

    return new Promise<OnCloseParameters<P>>(resolve => {
      const props = {
        ...initialProps,
        ...modalProps
      };

      const onCloseModal = (...args: OnCloseParameters<P>) => {
        context.hideModal(id);

        props.onClose?.(...args);
        resolve(args);
      };

      const modal = (
        <Component {...(props as P)} isOpen onClose={onCloseModal} key={id} />
      );

      context.showModal(id, modal);
    });
  };

  return [showModal];
};

export default useModal;
