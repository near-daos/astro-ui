import { Meta, Story } from '@storybook/react';
import { DaoPublicNotice } from 'features/create-dao/components/public-notice/DaoPublicNotice';
import React from 'react';

export default {
  title: 'Features/DAO Create/Dao Transparency Notice',
  component: DaoPublicNotice,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'bg',
      values: [
        {
          name: 'bg',
          value: '#E8E0FF'
        }
      ]
    }
  }
} as Meta;

export const Template: Story = (args): JSX.Element => (
  <DaoPublicNotice {...args} />
);

Template.storyName = 'Dao Transparency Notice';
