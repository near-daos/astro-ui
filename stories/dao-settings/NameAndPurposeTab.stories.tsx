import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  NameAndPurposeTab,
  NameAndPurposeTabProps
} from 'features/dao-settings/components/name-and-pupropse-tab';

export default {
  title: 'Features/DAO Settings/NameAndPurposeTab',
  component: NameAndPurposeTab
} as Meta;

export const Template: Story<NameAndPurposeTabProps> = (args): JSX.Element => (
  <NameAndPurposeTab {...args} />
);

Template.storyName = 'NameAndPurposeTab';

Template.args = {
  accountName: 'meowzers.sputnikdao.near'
};
