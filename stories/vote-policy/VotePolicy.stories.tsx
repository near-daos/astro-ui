import React from 'react';
import { Meta, Story } from '@storybook/react';
import { VotePolicyPopup, VotePolicyPopupProps } from 'features/vote-policy';

export default {
  title: 'Features/VotePolicyPopup',
  component: VotePolicyPopup,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    ),
  ],
} as Meta;

export const Template: Story<VotePolicyPopupProps> = args => (
  <VotePolicyPopup {...args} />
);

Template.storyName = 'VotePolicyPopup';
Template.args = {
  proposers: ['MEW holders', 'NEAR holders'],
  data: {
    whoCanPropose: ['MEW holders'],
    policies: [
      {
        whoCanVote: 'MEW holders',
        voteBy: 'Person',
        amount: 50,
        threshold: '% of group',
      },
    ],
  },
  isOpen: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
};
