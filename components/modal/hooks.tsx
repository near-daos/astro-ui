import { FunctionComponent, useContext } from 'react';
import { nanoid } from 'nanoid';
import { ModalContext, IModal } from './ModalContext';

type OnCloseParameters<T extends IModal> = Parameters<T['onClose']>;

type UseModalResult<T extends IModal> = [
  (props?: Partial<T>) => Promise<OnCloseParameters<T>>
];

type DefaultProps = {
  id?: string;
};

export const useModal = <P extends IModal>(
  Component: FunctionComponent<P>,
  initialProps?: Partial<P>
): UseModalResult<P> => {
  const context = useContext(ModalContext);

  const showModal = (modalProps: Partial<P> & DefaultProps = {}) => {
    const id = modalProps.id ?? nanoid();

    return new Promise<OnCloseParameters<P>>(resolve => {
      const props = {
        ...initialProps,
        ...modalProps,
      };

      const onCloseModal = (...args: OnCloseParameters<P>) => {
        resolve(args);
        context.hideModal(id);
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
