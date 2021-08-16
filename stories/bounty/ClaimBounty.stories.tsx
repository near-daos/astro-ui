import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  ClaimBountyDialog,
  ClaimBountyDialogProps
} from 'features/bounty/dialogs/claim-bounty-dialog/ClaimBountyDialog';

export default {
  title: 'Features/Bounty/Dialogs/ClaimBounty',
  component: ClaimBountyDialog
} as Meta;

export const Template: Story<ClaimBountyDialogProps> = (args): JSX.Element => (
  <ClaimBountyDialog {...args} />
);

Template.storyName = 'ClaimBounty';
Template.args = {
  isOpen: true,
  data: {
    bondDetail: {
      value: 0.3,
      token: 'NEAR'
    },
    type: 'Passed',
    status: 'In progress',
    token: 'NEAR',
    amount: 112,
    group:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    slots: 3,
    claimed: 1,
    claimedBy: [
      {
        name: 'annie.near',
        datetime: '2021-08-01'
      }
    ],
    claimedByMe: true,
    deadlineThreshold: 8,
    deadlineUnit: 'week'
  }
};
