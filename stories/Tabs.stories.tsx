import React, { ReactNode } from 'react';
import { Meta, Story } from '@storybook/react';
import { Tabs, TabsProps } from 'components/Tabs';
import { Badge } from 'components/Badge';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [story => <div style={{ padding: '1rem' }}>{story()}</div>],
} as Meta;

const Template: Story<TabsProps<ReactNode>> = (args): JSX.Element => (
  <Tabs {...args} isControlled={false} />
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
      ),
    },
    {
      id: 1,
      label: 'Long tab name',
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lightgreen' }}>
          Tab 2 content
        </div>
      ),
    },
    {
      id: 2,
      label: 'Tab 3',
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lightsalmon' }}>
          Tab 3 content
        </div>
      ),
    },
  ],
};

export const CustomTabsComponents = Template.bind({});

CustomTabsComponents.args = {
  tabs: [
    {
      id: 0,
      label: <Badge size="small">Tab 1</Badge>,
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lavender' }}>
          Tab 1 content
        </div>
      ),
    },
    {
      id: 1,
      label: (
        <Badge size="small" variant="orange">
          Tab 2
        </Badge>
      ),
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lightgreen' }}>
          Tab 2 content
        </div>
      ),
    },
    {
      id: 2,
      label: (
        <Badge size="medium" variant="turqoise">
          Tab 3
        </Badge>
      ),
      content: (
        <div style={{ padding: 24, marginTop: 5, background: 'lightsalmon' }}>
          Tab 3 content
        </div>
      ),
    },
  ],
};
