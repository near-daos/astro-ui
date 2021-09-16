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
    deadlineUnit: 'week',
    voteDetails: [
      { limit: '50%', label: 'MEW holders' },
      { limit: '50%', label: 'cool group' },
      { limit: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: 'NEAR'
    }
  }
};
