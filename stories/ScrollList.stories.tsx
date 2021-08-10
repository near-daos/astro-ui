import React from 'react';
import { Meta, Story } from '@storybook/react';
import ScrollList, { ScrollListProps } from 'components/scroll-list/ScrollList';
import {
  TokenCard,
  TokenCardProps,
  TokenName
} from 'components/cards/token-card';
import { nanoid } from 'nanoid';

export default {
  title: 'Components/ScrollList',
  component: ScrollList,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    )
  ]
} as Meta;

export const Template: Story<ScrollListProps> = args => (
  <ScrollList {...args} />
);

const tokenCards: Array<TokenCardProps> = [
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 50
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 90
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 80
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 30
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  },
  {
    id: nanoid(),
    tokenName: TokenName.NEAR,
    totalValue: 123123,
    tokensBalance: 1231231,
    voteWeight: 20
  }
];

Template.storyName = 'ScrollList';
Template.args = {
  height: 944,
  itemSize: 96,
  itemCount: tokenCards.length,
  renderItem: ({ index, style }) => {
    return (
      <div style={{ ...style, marginTop: '8px', marginBottom: '8px' }}>
        <TokenCard {...tokenCards[index]} />
      </div>
    );
  }
};
