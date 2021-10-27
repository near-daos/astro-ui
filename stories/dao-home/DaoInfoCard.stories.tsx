import { Meta, Story } from '@storybook/react';
import {
  DaoInfoCard,
  DaoInfoCardProps,
} from 'components/cards/dao-info-card/DaoInfoCard';
import React from 'react';

export default {
  title: 'Features/DAO Home/Cards/Dao Info',
  component: DaoInfoCard,
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
} as Meta;

export const Template: Story<DaoInfoCardProps> = (args): JSX.Element => (
  <DaoInfoCard {...args} />
);

Template.storyName = 'Dao Info';
Template.args = {
  items: [
    {
      label: 'Members',
      value: '96',
    },
    {
      label: 'DAO funds',
      value: '54,650.42 USD',
    },
  ],
};
