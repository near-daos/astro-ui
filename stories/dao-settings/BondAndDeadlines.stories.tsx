import { Meta, Story } from '@storybook/react';
import {
  BondsAndDeadlines,
  BondsAndDeadlinesTabProps
} from 'features/dao-settings/components/bond-and-deadlines-tab';
import React from 'react';

export default {
  title: 'Features/DAO Settings/BondsAndDeadlines',
  component: BondsAndDeadlines
} as Meta;

export const Template: Story<BondsAndDeadlinesTabProps> = (
  args
): JSX.Element => <BondsAndDeadlines {...args} />;

Template.storyName = 'BondsAndDeadlines';

Template.args = {
  createProposalBond: 1.1,
  proposalExpireTime: 7,
  claimBountyBond: 2,
  unclaimBountyTime: 3
};
