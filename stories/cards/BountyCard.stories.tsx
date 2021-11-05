import React from 'react';
import { Meta, Story } from '@storybook/react';
import { BountyCard, BountyCardProps } from 'components/cards/bounty-card';
import { TokenDeprecated } from 'types/token';

export default {
  title: 'Components/Cards/BountyCard',
  component: BountyCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey', maxWidth: 1024 }}>
        {story()}
      </div>
    )
  ]
} as Meta;

const Template: Story<BountyCardProps> = (args): JSX.Element => (
  <BountyCard {...args} />
);

export const Default = Template.bind({});

Default.args = {
  data: {
    id: '',
    forgivenessPeriod: '',
    token: TokenDeprecated.NEAR,
    amount: '112',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    deadlineThreshold: '',
    slots: 3,
    claimedBy: []
  }
};

export const InProgress = Template.bind({});

InProgress.args = {
  data: {
    id: '',
    forgivenessPeriod: '',
    token: TokenDeprecated.NEAR,
    amount: '112',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    deadlineThreshold: '',
    slots: 3,
    claimedBy: []
  }
};

export const InProgressClaimedByMe = Template.bind({});

InProgressClaimedByMe.args = {
  data: {
    id: '',
    forgivenessPeriod: '',
    token: TokenDeprecated.NEAR,
    amount: '112',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    slots: 3,
    claimedBy: [],
    deadlineThreshold: '8'
  }
};

export const Completed = Template.bind({});

Completed.args = {
  data: {
    id: '',
    forgivenessPeriod: '',
    token: TokenDeprecated.NEAR,
    amount: '34',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    slots: 3,
    claimedBy: [
      {
        accountId: 'vicky.near',
        starTime: '2021-01-01',
        deadline: ''
      }
    ],
    deadlineThreshold: '30'
  }
};
