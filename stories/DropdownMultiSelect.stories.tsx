import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  DropdownMultiSelect,
  DropdownMultiSelectProps
} from 'components/select/DropdownMultiSelect';
import { Badge } from 'components/badge/Badge';

export default {
  title: 'components/DropdownMultiSelect',
  component: DropdownMultiSelect,
  decorators: [
    story => (
      <div
        style={{ padding: '1rem', background: 'lightsalmon', maxWidth: 300 }}
      >
        {story()}
      </div>
    )
  ]
} as Meta;

export const Template: Story<DropdownMultiSelectProps> = (
  args
): JSX.Element => <DropdownMultiSelect {...args} />;

Template.storyName = 'DropdownMultiSelect';
Template.args = {
  options: [
    {
      label: 'Jason Born',
      component: <Badge size="small">Jason Born</Badge>,
      disabled: false
    },
    {
      label: 'James Bond, the Spy',
      component: <Badge size="small">James Bond, the Spy</Badge>,
      disabled: false
    },
    {
      label: 'Ethan Hunt',
      component: <Badge size="small">Ethan Hunt</Badge>,
      disabled: false
    }
  ],
  label: 'Who can propose'
};
