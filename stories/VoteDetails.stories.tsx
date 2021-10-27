import React from 'react';
import { Meta, Story } from '@storybook/react';
import { VoteDetails, VoteDetailsProps } from 'components/vote-details';

export default {
  title: 'components/VoteDetails',
  component: VoteDetails,
  decorators: [
    story => (
      <div
        style={{ padding: '1rem', background: 'lightgrey', maxWidth: '1024px' }}
      >
        {story()}
      </div>
    ),
  ],
} as Meta;

const Template: Story<VoteDetailsProps> = args => <VoteDetails {...args} />;

export const Default = Template.bind({});

Default.args = {
  showProgress: false,
};

export const VoteProgress = Template.bind({});

VoteProgress.args = {
  showProgress: true,
};

export const VoteProgressOneGroup = Template.bind({});

VoteProgressOneGroup.args = {
  showProgress: true,
};
