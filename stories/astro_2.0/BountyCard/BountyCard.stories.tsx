import React from 'react';

import { Meta, Story } from '@storybook/react';
import { BountyCard, BountyCardProps } from 'astro_2.0/components/BountyCard';
import { CardType } from 'astro_2.0/components/BountyCard/types';
import { BountyStatus } from 'types/bounties';

export default {
  title: 'astro_2.0/BountyCard',
  component: BountyCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#e5e5e5', maxWidth: 885 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<BountyCardProps> = (args): JSX.Element => (
  <BountyCard {...args} />
);

Template.storyName = 'BountyCard';

Template.args = {
  showActionBar: true,
  completeHandler: () => {
    // eslint-disable-next-line no-console
    console.log('test');
  },
  content: {
    id: '',
    daoId: '',
    type: CardType.Claim,
    status: BountyStatus.Expired,
    claimedByCurrentUser: false,
    timeToComplete: '',
    slots: 3,
    bountyBond: '0.1',
    amount: '1000',
    forgivenessPeriod: '3',
    token: {
      tokenId: '',
      symbol: 'NEAR',
      balance: '5603284827495119399999994',
      icon: '',
      decimals: 24,
      price: null,
      id: 'NEAR',
    },
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet ornare vitae consequat. Potenti ut urna, ultricies elit nam. Feugiat porta elit ultricies eu mollis. Faucibus mauris faucibus aliquam non. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    externalUrl: 'google.com',
  },
};
