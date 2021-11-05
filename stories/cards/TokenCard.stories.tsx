import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  TokenCard,
  TokenCardProps
} from 'components/cards/token-card/TokenCard';
import { Header } from 'components/cards/token-card/components/header';
import { TokenDeprecated } from 'types/token';

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
  symbol: TokenDeprecated.NEAR,
  icon: 'near',
  balance: 877,
  totalValue: '80569'
};
