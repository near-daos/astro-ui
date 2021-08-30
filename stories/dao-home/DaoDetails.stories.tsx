import { Meta, Story } from '@storybook/react';

import {
  DaoDetails,
  DaoDetailsProps
} from 'features/dao-home/components/dao-details/DaoDetails';
import React from 'react';
import flag from './assets/flag.png';

export default {
  title: 'Features/DAO Home/DaoDetails',
  component: DaoDetails,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'primary',
      values: [
        {
          name: 'primary',
          value: '#E8E0FF'
        }
      ]
    }
  }
} as Meta;

export const Template: Story<DaoDetailsProps> = (args): JSX.Element => {
  return <DaoDetails {...args} />;
};

Template.storyName = 'DaoDetails';

Template.args = {
  title: 'Meowzers',
  subtitle: 'meowzers.sputnikdao.near',
  description: `We’re a community grant for artists who want to build projects on our
    platform. Join our Discord channel to stay up to date with latest info!`,
  flag,
  links: ['http://example.com', 'http://discord.com', 'http://twitter.com']
};
