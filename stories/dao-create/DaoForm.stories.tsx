import { Meta, Story } from '@storybook/react';
import {
  DaoCreateForm,
  IDaoCreateForm,
} from 'features/create-dao/components/dao-create-form/DaoCreateForm';
import React from 'react';

export default {
  title: 'Features/DAO Create/Dao Create Form',
  component: DaoCreateForm,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'bg',
      values: [
        {
          name: 'bg',
          value: '#E8E0FF',
        },
      ],
    },
  },
} as Meta;

export const Template: Story<IDaoCreateForm> = (args): JSX.Element => (
  <DaoCreateForm onSubmit={() => 1} {...args} />
);

Template.storyName = 'Dao Create Form';

Template.args = {};
