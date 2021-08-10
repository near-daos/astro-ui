import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  TokenCard,
  TokenCardProps,
  TokenName
} from 'components/cards/token-card/TokenCard';
import { Header } from 'components/cards/token-card/components/header';

export default {
  title: 'Components/cards/TokenCard',
  component: TokenCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#f7f5fc' }}>{story()}</div>
    )
  ]
} as Meta;

export const Template: Story<TokenCardProps> = (args): JSX.Element => (
  <>
    <Header />
    <TokenCard {...args} />
  </>
);

Template.storyName = 'TokenCard';

Template.args = {
  tokenName: TokenName.NEAR,
  tokensBalance: 877,
  totalValue: 80569,
  voteWeight: 50
};
