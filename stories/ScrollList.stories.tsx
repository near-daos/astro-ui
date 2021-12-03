import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ScrollList, ScrollListProps } from 'astro_2.0/components/ScrollList';
import { TokenCard } from 'components/cards/TokenCard';

export default {
  title: 'Components/ScrollList',
  component: ScrollList,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    ),
  ],
} as Meta;

export const Template: Story<ScrollListProps> = args => (
  <ScrollList {...args} />
);

const generateTokens = () => {
  const cards = [];

  for (let i = 0; i < 30; i += 1) {
    cards.push({
      tokenId: 'NEAR',
      decimals: 0,
      symbol: '',
      icon: 'near',
      totalValue: '123123',
      balance: 1231231,
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
        <TokenCard
          {...tokenCards[index]}
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log('clicked');
          }}
          isActive={false}
        />
      </div>
    );
  },
};
