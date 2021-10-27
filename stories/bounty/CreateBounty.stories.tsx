import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  CreateBountyDialog,
  CreateBountyDialogProps,
} from 'features/bounty/dialogs/create-bounty-dialog/CreateBountyDialog';

export default {
  title: 'Features/Bounty/Dialogs/CreateBounty',
  component: CreateBountyDialog,
} as Meta;

export const Template: Story<CreateBountyDialogProps> = (args): JSX.Element => (
  <CreateBountyDialog {...args} />
);

Template.storyName = 'CreateBounty';
Template.args = {
  isOpen: true,
  initialValues: {
    token: 'NEAR',
    slots: 3,
    amount: 0,
    deadlineThreshold: 3,
    deadlineUnit: 'day',
    externalUrl: '',
    details: '',
  },
};
