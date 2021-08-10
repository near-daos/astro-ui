import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  UnfollowPopup,
  UnfollowPopupProps
} from 'features/dao-home/components/unfollow-popup/UnfollowPopup';

export default {
  title: 'Features/DAO Home/Popups/UnfollowPopup',
  component: UnfollowPopup
} as Meta;

export const Template: Story<UnfollowPopupProps> = (args): JSX.Element => (
  <UnfollowPopup {...args} />
);

Template.storyName = 'UnfollowPopup';
Template.args = {
  isOpen: true,
  target: 'meowzers'
};
