import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  ClaimBountyDialog,
  ClaimBountyDialogProps,
} from 'features/bounty/dialogs/claim-bounty-dialog/ClaimBountyDialog';

export default {
  title: 'Features/Bounty/Dialogs/ClaimBounty',
  component: ClaimBountyDialog,
} as Meta;

export const Template: Story<ClaimBountyDialogProps> = (args): JSX.Element => (
  <ClaimBountyDialog {...args} />
);

Template.storyName = 'ClaimBounty';
Template.args = {
  isOpen: true,
  data: {
    id: '',
    forgivenessPeriod: '',
    tokenId: '',
    amount: '112',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    slots: 3,
    claimedBy: [],
    deadlineThreshold: '8',
  },
};
