import { Meta, Story } from '@storybook/react';
import { Button } from 'components/button/Button';
import { ModalProvider, useModal } from 'components/modal';

import {
  ProposalSubmittedModal,
  ProposalSubmittedModalProps,
} from 'features/proposal/components/proposal-submitted-modal/ProposalSubmittedModal';
import React, { FC, useCallback } from 'react';

export default {
  title: 'Features/Proposal/Popups/Proposal Submitted Modal',
  decorators: [story => <ModalProvider>{story()}</ModalProvider>],
} as Meta;

const DemoComponent: FC<{ modalProps: ProposalSubmittedModalProps }> = ({
  modalProps,
}) => {
  const [showModal] = useModal<ProposalSubmittedModalProps>(
    ProposalSubmittedModal,
    {
      ...modalProps,
    }
  );

  const handleClick = useCallback(async () => {
    await showModal();
  }, [showModal]);

  return (
    <Button type="button" onClick={handleClick}>
      Show Modal
    </Button>
  );
};

export const Template: Story<ProposalSubmittedModalProps> = (
  args
): JSX.Element => <DemoComponent modalProps={args} />;

Template.storyName = 'Proposal Submitted Modal';
