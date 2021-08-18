import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  StakeTokensPopup,
  StakeTokensPopupProps
} from 'features/voting-token/components/stake-tokens-popup';

export default {
  title: 'Features/VotingToken/StakeTokensPopup',
  component: StakeTokensPopup
} as Meta;

export const Template: Story<StakeTokensPopupProps> = (args): JSX.Element => (
  <StakeTokensPopup {...args} />
);

Template.storyName = 'StakeTokensPopup';
Template.args = {
  isOpen: true,
  token: {
    name: 'GOOSE',
    symbol: 'goose.tkn.farm',
    balance: 9,
    id: '1'
  },
  rate: 18
};
