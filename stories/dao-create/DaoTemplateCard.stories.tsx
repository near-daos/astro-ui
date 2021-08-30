import { Meta, Story } from '@storybook/react';
import {
  DaoTemplateCard,
  DaoTemplateCardProps
} from 'features/create-dao/components/template/DaoTemplateCard';
import React from 'react';

export default {
  title: 'Features/DAO Create/Dao DAOTemplate Card',
  component: DaoTemplateCard,
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

export const Template: Story<DaoTemplateCardProps> = (args): JSX.Element => (
  <DaoTemplateCard {...args} />
);

Template.storyName = 'Dao DAOTemplate Card';

Template.args = {
  variant: 'foundation',
  title: 'Foundation',
  description: `A group giving donations\nAn organization funding community projects\nA fund for open-source projects`
};

Template.argTypes = {
  variant: {
    options: ['club', 'cooperative', 'corporation', 'foundation'],
    control: { type: 'select' }
  }
};
