import React from 'react';
import { Toggle } from 'components/inputs/Toggle';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  argTypes: {
    checked: { control: 'boolean' },
  },
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof Toggle>
): JSX.Element => (
  <>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Toggle {...args} />
  </>
);

Template.storyName = 'Toggle';
Template.args = {
  id: 'note01',
  label: 'Notify me about the creation of a DAO with a Cooperative Structure',
};
