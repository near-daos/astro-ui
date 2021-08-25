import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  TasksTabView,
  TasksTabViewProps
} from 'features/vote-policy/components/tasks-tab-view';

export default {
  title: 'Features/VotingPolicy/TasksTabView',
  component: TasksTabView
} as Meta;

export const Template: Story<TasksTabViewProps> = (args): JSX.Element => (
  <TasksTabView {...args} />
);

Template.storyName = 'TasksTabView';

Template.args = {};
