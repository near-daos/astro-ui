import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  VotingToken,
  VotingTokenProps
} from 'features/voting-token/components/voting-token';

export default {
  title: 'Features/VotingToken/VotingToken',
  component: VotingToken,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey', maxWidth: 1024 }}>
        {story()}
      </div>
    )
  ]
} as Meta;

export const Template: Story<VotingTokenProps> = (args): JSX.Element => (
  <VotingToken {...args} />
);

Template.storyName = 'VotingToken';
Template.args = {
  token: {
    id: '1',
    tokenName: 'GOOSE',
    tokenSymbol: 'goose.tkn.farm',
    balance: 19
  },
  balance: 1234.22
};
