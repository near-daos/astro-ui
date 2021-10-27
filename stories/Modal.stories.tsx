import React, { FC, useCallback } from 'react';
import { Meta, Story } from '@storybook/react';
import { Modal, ModalProvider, useModal } from 'components/modal';
import { Button } from 'components/button/Button';

interface IMyModal {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

const DemoModal: FC<IMyModal> = ({ title, description, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1>{title}</h1>
      <p>{description}</p>
      <Button type="button" onClick={() => onClose()} variant="secondary">
        Cancel
      </Button>
      &nbsp;&nbsp;
      <Button type="submit" onClick={() => onClose(true)}>
        Submit
      </Button>
    </Modal>
  );
};

interface DemoComponentProps {
  handleModalOutput: (res: unknown) => void;
}

const DemoComponent: FC<DemoComponentProps> = ({ handleModalOutput }) => {
  const [showModal] = useModal(DemoModal, {
    title: 'This is my new modal',
    description: 'This is my description',
  });

  const handleClick = useCallback(async () => {
    const response = await showModal();

    handleModalOutput(response);
  }, [showModal, handleModalOutput]);

  return (
    <div>
      <Button type="button" onClick={handleClick}>
        Try Modal
      </Button>
    </div>
  );
};

export default {
  title: 'Components/Modal',
  component: DemoComponent,
  decorators: [story => <ModalProvider>{story()}</ModalProvider>],
  argTypes: {
    handleModalOutput: { action: 'clicked' },
  },
} as Meta;

export const Template: Story<DemoComponentProps> = (args): JSX.Element => (
  <DemoComponent {...args} />
);

Template.storyName = 'Modal';
Template.args = {};
