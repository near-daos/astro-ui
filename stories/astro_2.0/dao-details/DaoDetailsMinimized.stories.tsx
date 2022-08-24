import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  DaoDetailsMinimized,
  DaoDetailsMinimizedProps,
} from 'astro_2.0/components/DaoDetails';

export default {
  title: 'astro_2.0/DaoDetails/DaoDetailsMinimized',
  component: DaoDetailsMinimized,
  decorators: [
    story => (
      <div
        style={{
          padding: '3rem 1rem 1rem 1rem',
          background: '#e5e5e5',
          maxWidth: 960,
        }}
      >
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<DaoDetailsMinimizedProps> = (
  args
): JSX.Element => <DaoDetailsMinimized {...args} />;

Template.storyName = 'DaoDetailsMinimized';

Template.args = {
  onCreateProposalClick: () => {
    // eslint-disable-next-line no-console
    console.log('create proposal');
  },
  dao: {
    id: 'saturn.sputnikv2.testnet',
    logo: 'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg',
    displayName: 'Saturn',
    daoMembersList: ['jason.near'],
  },
};
