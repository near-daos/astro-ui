import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  DaoDetailsPreview,
  DaoDetailsPreviewProps,
} from 'astro_2.0/components/DaoDetails';

export default {
  title: 'astro_2.0/DaoDetails/DaoDetailsPreview',
  component: DaoDetailsPreview,
  decorators: [
    story => (
      <div
        style={{
          padding: '1rem 1rem 1rem 10rem',
          background: '#e5e5e5',
          maxWidth: 1280,
        }}
      >
        {story()}
      </div>
    ),
  ],
} as Meta;

export const Template: Story<DaoDetailsPreviewProps> = (args): JSX.Element => (
  <DaoDetailsPreview {...args} />
);

Template.storyName = 'DaoDetailsPreview';

Template.args = {
  dao: {
    id: 'saturn.sputnikv2.testnet',
    name: 'saturn',
    description:
      'We’re a community grant for artists who want to build projects on our platform. Join our Discord channel to stay up to date with latest info!',
    flagCover:
      'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg',
    funds: '17043.60259',
    links: ['example.com'],
    displayName: 'Saturn',
  },
};
