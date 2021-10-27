import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  FollowPopup,
  FollowPopupProps,
} from 'features/dao-home/components/follow-popup/FollowPopup';

export default {
  title: 'Features/DAO Home/Popups/FollowPopup',
  component: FollowPopup,
} as Meta;

export const Template: Story<FollowPopupProps> = (args): JSX.Element => (
  <FollowPopup {...args} />
);

Template.storyName = 'FollowPopup';
Template.args = {
  isOpen: true,
  target: 'meowzers',
};
