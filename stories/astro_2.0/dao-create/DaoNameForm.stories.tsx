import { Meta, Story } from '@storybook/react';
import { DaoNameForm } from 'astro_2.0/features/CreateDao/components/DaoNameForm/DaoNameForm';
import React from 'react';

export default {
  title: 'astro_2.0/DAO Create/Dao Name Form',
  component: DaoNameForm,
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

export const Template: Story = (args): JSX.Element => <DaoNameForm {...args} />;

Template.storyName = 'Dao Name Form';

Template.args = {};
