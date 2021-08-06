import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  CreateBountyDialog,
  CreateBountyDialogProps
} from 'components/bounty/create-bounty-dialog/create-bounty-dialog';

export default {
  title: 'Components/CreateBounty',
  component: CreateBountyDialog,
  decorators: [
    story => (
      <div
        style={{
          padding: 48,
          background: 'white',
          maxWidth: 640,
          border: '1px solid grey'
        }}
      >
        {story()}
      </div>
    )
  ]
} as Meta;

export const Template: Story<CreateBountyDialogProps> = (args): JSX.Element => (
  <CreateBountyDialog {...args} />
);

Template.storyName = 'CreateBounty';
Template.args = {
  initialValues: {
    token: 'NEAR',
    slots: 3,
    amount: 0,
    deadlineThreshold: 3,
    deadlineUnit: 'day',
    externalUrl: '',
    group: ''
  }
};
