import { Meta, Story } from '@storybook/react';
import { IconButton, IconButtonProps } from 'components/button/IconButton';
import React from 'react';

export const Template: Story<IconButtonProps> = args => {
  const { icon } = args;

  if (!icon) return <div>Select icon</div>;

  return <IconButton {...args} />;
};

Template.args = {
  icon: 'buttonRefresh',
  size: 'large',
};

Template.storyName = 'Icon Button';

export default {
  title: 'Components/Buttons/Icon Button',
  component: IconButton,
} as Meta;
