import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  UsePluginPopup,
  UsePluginPopupProps,
} from 'astro_2.0/features/pages/plugins/UsePluginPopup/UsePluginPopup';

export default {
  title: 'Features/Plugins/Popups/UsePluginPopup',
  component: UsePluginPopup,
} as Meta;

export const Template: Story<UsePluginPopupProps> = (args): JSX.Element => (
  <UsePluginPopup {...args} />
);

Template.storyName = 'UsePluginPopup';
Template.args = {
  isOpen: true,
  initialData: {
    functions: [
      {
        id: '1',
        functionName: 'Token Farm: Create new token',
        code: '{"contract":"app.tokenfarm.near","method":"createToken","description":"Create a new token on token farm","args":[]}',
      },
    ],
  },
};
