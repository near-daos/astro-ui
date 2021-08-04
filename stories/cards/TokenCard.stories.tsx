import React from 'react';
import { Meta } from '@storybook/react';
import { TokenCard } from 'components/cards/token-card/TokenCard';

export default {
  title: 'Components/cards/TokenCard',
  component: TokenCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    )
  ]
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof TokenCard>
): JSX.Element => (
  <>
    <TokenCard {...args} />
  </>
);

Template.storyName = 'TokenCard';

Template.args = {
  tokenName: 'NEAR',
  tokensAmount: 877,
  totalCost: 80569,
  voteWeight: 50
};
