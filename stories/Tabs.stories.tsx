import React from 'react';
import { Meta, Story } from '@storybook/react';
import Tabs, { TabsProps } from 'components/tabs/Tabs';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [story => <div style={{ padding: '1rem' }}>{story()}</div>]
} as Meta;

const Template: Story<TabsProps<string>> = (args): JSX.Element => (
  <Tabs {...args} />
);

export const Default = Template.bind({});

Default.args = {
  tabs: [
    {
      id: 0,
      label: 'Tab 1',
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lavender' }}>
          Tab 1 content
        </div>
      )
    },
    {
      id: 1,
      label: 'Long tab name',
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lightgreen' }}>
          Tab 2 content
        </div>
      )
    },
    {
      id: 2,
      label: 'Tab 3',
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lightsalmon' }}>
          Tab 3 content
        </div>
      )
    }
  ]
};
