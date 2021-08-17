import { Meta, Story } from '@storybook/react';
import { Button } from 'components/button/Button';
import { ModalProvider, useModal } from 'components/modal';
import { DaoSettingOption } from 'features/create-dao/components/option-card/DaoOptionCard';
import {
  DaoTemplateModal,
  DaoTemplateModalProps
} from 'features/create-dao/components/template-modal/DaoTemplateModal';
import React, { FC, useCallback } from 'react';

const options: DaoSettingOption[] = [
  {
    value: 'open',
    icon: 'illustrationOpenOrganization',
    subject: 'proposals',
    title: 'Open',
    description: 'Anyone can submit a proposal.'
  },
  {
    value: 'members',
    icon: 'illustrationGroupsAndCommitttees',
    subject: 'proposals',
    title: 'Members Only',
    description: 'Only members or token-holders can submit a proposal.'
  },
  {
    value: 'members',
    icon: 'illustrationVotePerMember',
    subject: 'proposals',
    title: 'Democratic',
    description: 'Every member gets one vote.'
  }
];

export default {
  title: 'Features/DAO Create/Popups/Template Modal',
  decorators: [story => <ModalProvider>{story()}</ModalProvider>]
} as Meta;

const DemoComponent: FC<{ modalProps: DaoTemplateModalProps }> = ({
  modalProps
}) => {
  const [showModal] = useModal<DaoTemplateModalProps>(DaoTemplateModal, {
    ...modalProps,
    options,
    title: 'Who can create proposals?',
    description: `Proposals aren't like voting on a question, requesting funds or adding new members. Every proposal has to be voted on.`
  });

  const handleClick = useCallback(async () => {
    await showModal();
  }, [showModal]);

  return (
    <div>
      <Button type="button" onClick={handleClick}>
        Show Modal
      </Button>
    </div>
  );
};

export const Template: Story<DaoTemplateModalProps> = (args): JSX.Element => (
  <DemoComponent modalProps={args} />
);

Template.args = {
  variant: 'Cooperative'
};

Template.argTypes = {
  variant: {
    options: ['Club', 'Cooperative', 'Corporation', 'Foundation'],
    control: { type: 'select' }
  }
};

Template.storyName = 'Template Modal';
