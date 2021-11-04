import { Meta, Story } from '@storybook/react';
import { DaoLinksForm } from 'astro_2.0/features/CreateDao/components/DaoLinksForm/DaoLinksForm';
import React from 'react';

export default {
  title: 'astro_2.0/DAO Create/Dao Links Form',
  component: DaoLinksForm,
  decorators: [
    story => (
      <div
        style={{
          padding: '1rem',
          background: '#F0F0F0',
          width: '100%',
          maxWidth: 960,
        }}
      >
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story = (args): JSX.Element => (
  <DaoLinksForm {...args} />
);

Template.storyName = 'Dao Links Form';

Template.args = {};
