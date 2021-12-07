import React from 'react';
import { Meta } from '@storybook/react';
import { TextArea } from 'components/inputs/TextArea';

export default {
  title: 'Components/TextArea',
  component: TextArea,
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof TextArea>
): JSX.Element => <TextArea {...args} />;

Template.storyName = 'TextArea';
Template.args = {
  label: 'Label',
  placeholder: 'Sample text',
  maxLength: 500,
};
