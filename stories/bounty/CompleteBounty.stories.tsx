import React from 'react';
import { Meta, Story } from '@storybook/react';

import {
  CompleteBountyDialog,
  CompleteBountyDialogProps
} from 'features/bounty/dialogs/complete-bounty-dialog/CompleteBountyDialog';

export default {
  title: 'Features/Bounty/Dialogs/CompleteBounty',
  component: CompleteBountyDialog
} as Meta;

export const Template: Story<CompleteBountyDialogProps> = (
  args
): JSX.Element => <CompleteBountyDialog {...args} />;

Template.storyName = 'CompleteBounty';
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
    deadlineThreshold: '8'
  }
};
