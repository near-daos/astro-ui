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
  accountName: 'meowzers.sputnikdao.near',
  name: 'meowzers',
  purpose:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis eleifend habitant laoreet ornare vitae consequat. Potenti ut urna, ultricies elit nam. Feugiat porta elit ultricies eu mollis. Faucibus mauris faucibus aliquam non. '
};
