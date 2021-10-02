import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  BountyInfoCard,
  BountyInfoCardProps
} from 'components/cards/bounty-info-card';
import { Token } from 'types/token';

export default {
  title: 'Components/Cards/BountyCard/BountyInfoCard',
  component: BountyInfoCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey', maxWidth: 1024 }}>
        {story()}
      </div>
    )
  ]
} as Meta;

export const Template: Story<BountyInfoCardProps> = (args): JSX.Element => (
  <BountyInfoCard {...args} />
);

Template.storyName = 'BountyInfoCard';

Template.args = {
  data: {
    id: '',
    forgivenessPeriod: '',
    token: Token.NEAR,
    amount: '253',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    externalUrl: '',
    slots: 3,
    claimedBy: [],
    deadlineThreshold: '30'
  }
};
