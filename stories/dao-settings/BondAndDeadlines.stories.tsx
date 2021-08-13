import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  BondsAndDeadlines,
  BondsAndDeadlinesTabProps
} from 'features/dao-settings/components/bond-and-deadlines-tab';

export default {
  title: 'Features/DAO Settings/BondsAndDeadlines',
  component: BondsAndDeadlines
} as Meta;

export const Template: Story<BondsAndDeadlinesTabProps> = (
  args
): JSX.Element => <BondsAndDeadlines {...args} />;

Template.storyName = 'LinksTab';

Template.args = {};
