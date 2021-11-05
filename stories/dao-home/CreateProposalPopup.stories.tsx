import React from 'react';

import { Meta, Story } from '@storybook/react';

import {
  CreateProposalPopup,
  CreateProposalPopupProps
} from 'features/dao-home/components/create-proposal-popup/CreateProposalPopup';

export default {
  title: 'Features/DAO Home/Popups/CreateProposalPopup',
  component: CreateProposalPopup
} as Meta;

export const Template: Story<CreateProposalPopupProps> = (
  args
): JSX.Element => <CreateProposalPopup {...args} />;

Template.storyName = 'CreateProposalPopup';

Template.args = {
  isOpen: true
};
