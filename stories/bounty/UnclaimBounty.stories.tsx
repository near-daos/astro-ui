import React from 'react';
import { Meta, Story } from '@storybook/react';

import {
  UnclaimBountyDialog,
  UnclaimBountyDialogProps
} from 'features/bounty/dialogs/unclaim-bounty-dialog/UnclaimBountyDialog';

export default {
  title: 'Features/Bounty/Dialogs/UnclaimBounty',
  component: UnclaimBountyDialog
} as Meta;

export const Template: Story<UnclaimBountyDialogProps> = (
  args
): JSX.Element => <UnclaimBountyDialog {...args} />;

Template.storyName = 'UnclaimBounty';
Template.args = {
  isOpen: true,
  data: {
    id: '',
    forgivenessPeriod: '',
    token: 'NEAR',
    amount: 112,
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    slots: 3,
    claimedBy: [],
    deadlineThreshold: '8'
  }
};
