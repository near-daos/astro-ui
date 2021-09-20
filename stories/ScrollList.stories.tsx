import React from 'react';
import { Meta, Story } from '@storybook/react';
import ScrollList, { ScrollListProps } from 'components/scroll-list/ScrollList';
import { TokenCard } from 'components/cards/token-card';
import { nanoid } from 'nanoid';
import { Token } from 'types/token';

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

const generateTokens = () => {
  const cards = [];

  for (let i = 0; i < 30; i += 1) {
    cards.push({
      id: nanoid(),
      tokenName: Token.NEAR,
      totalValue: 123123,
      tokensBalance: 1231231,
      voteWeight: 50,
      href: ''
    });
  }

  return cards;
};

const tokenCards = generateTokens();

Template.storyName = 'ScrollList';
Template.args = {
  height: 944,
  itemSize: () => 96,
  itemCount: tokenCards.length,
  renderItem: ({ index, style }) => {
    return (
      <div style={{ ...style, marginTop: '8px', marginBottom: '8px' }}>
        <TokenCard {...tokenCards[index]} />
      </div>
    );
  }
};
