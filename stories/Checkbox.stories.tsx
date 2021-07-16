import React from 'react';
import { Checkbox } from 'components/checkbox/Checkbox';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: 'boolean' }
  }
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof Checkbox>
): JSX.Element => (
  <>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Checkbox {...args} />
  </>
);

Template.storyName = 'Checkbox';
Template.args = {
  label: 'Checkbox'
};
