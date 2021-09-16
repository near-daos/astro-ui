import React from 'react';
import { Meta, Story } from '@storybook/react';

import {
  CreatePollDialog,
  CreatePollDialogProps
} from 'features/poll/dialogs/create-poll-dialog/CreatePollDialog';

export default {
  title: 'Features/Poll/CreatePoll',
  component: CreatePollDialog
} as Meta;

export const Template: Story<CreatePollDialogProps> = (args): JSX.Element => (
  <CreatePollDialog {...args} />
);

Template.storyName = 'CreatePoll';
Template.args = {
  isOpen: true,
  voteDetails: [
    { limit: '50%', label: 'MEW holders' },
    { limit: '50%', label: 'cool group' },
    { limit: '1 person', label: 'Ombudspeople' }
  ],
  bondDetail: {
    value: 0.3,
    token: 'NEAR'
  }
};
