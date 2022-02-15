import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  DropdownMultiSelect,
  DropdownMultiSelectProps,
} from 'components/inputs/selects/DropdownMultiSelect';
import { Badge } from 'components/Badge';

export default {
  title: 'components/DropdownMultiSelect',
  component: DropdownMultiSelect,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#FAFAFA', maxWidth: 300 }}>
        {story()}
      </div>
    ),
  ],
} as Meta;

const Template: Story<DropdownMultiSelectProps> = (args): JSX.Element => (
  <DropdownMultiSelect {...args} />
);

export const Default = Template.bind({});

Default.args = {
  options: [
    {
      label: 'Jason Born',
      component: <Badge size="small">Jason Born</Badge>,
      disabled: false,
    },
    {
      label: 'James Bond, the Spy',
      component: <Badge size="small">James Bond, the Spy</Badge>,
      disabled: false,
    },
    {
      label: 'Ethan Hunt',
      component: <Badge size="small">Ethan Hunt</Badge>,
      disabled: false,
    },
  ],
  label: 'Who can propose',
};

export const Simple = Template.bind({});

Simple.args = {
  options: [
    {
      label: 'mintbase',
      component: <div>Mintbase</div>,
    },
    {
      label: 'paras',
      component: <div>Paras</div>,
    },
    {
      label: 'berryclub',
      component: <div>Berry Club</div>,
    },
  ],
  label: 'Smart contract',
  simple: true,
};
