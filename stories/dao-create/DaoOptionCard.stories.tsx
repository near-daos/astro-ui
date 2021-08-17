import { Meta, Story } from '@storybook/react';
import { Icon } from 'components/Icon';
import {
  DaoOptionCard,
  DaoOptionCardProps
} from 'features/create-dao/components/option-card/DaoOptionCard';
import React from 'react';

export default {
  title: 'Features/DAO Create/Dao Option Card',
  component: DaoOptionCard,
  parameters: {
    layout: 'centered'
  }
} as Meta;

export const Template: Story<DaoOptionCardProps> = (args): JSX.Element => (
  <DaoOptionCard {...args} />
);

Template.storyName = 'Dao Option Card';

Template.args = {
  active: false,
  iconNode: <Icon width={56} name="illustrationTokenWeighted" />,
  subject: 'proposals',
  title: 'Open',
  description: 'Anyone can submit a proposal.'
};
