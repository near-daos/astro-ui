import React from 'react';
import { Meta, Story } from '@storybook/react';
import { BountyCard, BountyCardProps } from 'components/cards/bounty-card';
import { TokenName } from 'components/cards/token-card';

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
    type: 'Passed',
    status: 'Open',
    token: TokenName.NEAR,
    amount: 253,
    group:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    externalUrl: '',
    slots: 3,
    claimed: 0,
    claimedBy: [],
    claimedByMe: false,
    deadlineThreshold: 30,
    deadlineUnit: 'day',
    voteDetails: [
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: TokenName.NEAR
    }
  }
};

export const InProgress = Template.bind({});

InProgress.args = {
  data: {
    type: 'Passed',
    status: 'In progress',
    token: TokenName.NEAR,
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
    claimedByMe: false,
    deadlineThreshold: 8,
    deadlineUnit: 'week',
    voteDetails: [
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: TokenName.NEAR
    }
  }
};

export const InProgressClaimedByMe = Template.bind({});

InProgressClaimedByMe.args = {
  data: {
    type: 'Passed',
    status: 'In progress',
    token: TokenName.NEAR,
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
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: TokenName.NEAR
    }
  }
};

export const Completed = Template.bind({});

Completed.args = {
  data: {
    type: 'Passed',
    status: 'Completed',
    token: TokenName.NEAR,
    amount: 34,
    group:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
    externalUrl: '',
    slots: 3,
    claimed: 2,
    claimedBy: [
      {
        name: 'vicky.near',
        datetime: '2021-01-01'
      }
    ],
    claimedByMe: true,
    deadlineThreshold: 30,
    deadlineUnit: 'day',
    voteDetails: [
      { value: '50%', label: 'MEW holders' },
      { value: '50%', label: 'cool group' },
      { value: '1 person', label: 'Ombudspeople' }
    ],
    bondDetail: {
      value: 0.3,
      token: TokenName.NEAR
    }
  }
};
