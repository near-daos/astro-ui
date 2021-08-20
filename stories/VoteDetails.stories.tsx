import React from 'react';
import { Meta, Story } from '@storybook/react';
import { VoteDetails, VoteDetailsProps } from 'components/vote-details';

export default {
  title: 'components/VoteDetails',
  component: VoteDetails,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    )
  ]
} as Meta;

export const Template: Story<VoteDetailsProps> = args => (
  <VoteDetails {...args} />
);

Template.storyName = 'VoteDetails';
Template.args = {
  voteDetails: [
    { value: '50%', label: 'MEW holders' },
    { value: '50%', label: 'cool group' },
    { value: '1 person', label: 'Ombudspeople' }
  ],
  bondDetail: {
    value: 0.3,
    token: 'NEAR'
  }
};
