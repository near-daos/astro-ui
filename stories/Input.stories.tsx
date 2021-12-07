import React from 'react';
import { Meta } from '@storybook/react';
import { Input } from 'components/inputs/Input';

export default {
  title: 'Components/Input',
  component: Input,
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof Input>
): JSX.Element => <Input {...args} />;

Template.storyName = 'Input';
Template.args = {
  label: 'Label',
  placeholder: 'Sample text',
};
