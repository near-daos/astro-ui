import { Meta, Story } from '@storybook/react';
import { Button } from 'components/button/Button';
import { ModalProvider, useModal } from 'components/modal';
import {
  DaoTemplateModal,
  DaoTemplateModalProps
} from 'features/create-dao/components/template/DaoTemplateModal';
import { DaoSettingOption } from 'pages/create-dao/steps/types';
import React, { FC, useCallback } from 'react';

const options: DaoSettingOption<string>[] = [
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
  title: 'Features/DAO Create/Popups/DAOTemplate Modal',
  decorators: [story => <ModalProvider>{story()}</ModalProvider>]
} as Meta;

const DemoComponent: FC<{ modalProps: DaoTemplateModalProps }> = ({
  modalProps
}) => {
  const [showModal] = useModal<DaoTemplateModalProps>(DaoTemplateModal, {
    ...modalProps,
    options,
    title: 'Foundation',
    description: `A DAO where anyone can submit a new vote, but only a small committee efficiently votes on decisions and distributing funds.`
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
  variant: 'cooperative'
};

Template.argTypes = {
  variant: {
    options: ['club', 'cooperative', 'corporation', 'foundation'],
    control: { type: 'select' }
  }
};

Template.storyName = 'DAOTemplate Modal';
