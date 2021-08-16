import React from 'react';
import { Meta, Story } from '@storybook/react';
import { VotingTokenPopup, VotingTokenPopupProps } from 'features/voting-token';

export default {
  title: 'Features/VotingToken/VotingTokenPopup',
  component: VotingTokenPopup
} as Meta;

export const Template: Story<VotingTokenPopupProps> = (args): JSX.Element => (
  <VotingTokenPopup {...args} />
);

Template.storyName = 'VotingTokenPopup';
Template.args = {
  isOpen: true
};
