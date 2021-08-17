import { Meta, Story } from '@storybook/react';
import {
  DaoTemplateCard,
  DaoTemplateCardProps
} from 'features/create-dao/components/template-card/DaoTemplateCard';
import React from 'react';

export default {
  title: 'Features/DAO Create/Dao Template Card',
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

Template.storyName = 'Dao Template Card';

Template.args = {
  variant: 'Foundation',
  title: 'Foundation',
  description: `A group giving donations\nAn organization funding community projects\nA fund for open-source projects`
};

Template.argTypes = {
  variant: {
    options: ['Club', 'Cooperative', 'Corporation', 'Foundation'],
    control: { type: 'select' }
  }
};
