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
  isOpen: true
};
