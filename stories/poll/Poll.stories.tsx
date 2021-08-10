import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  ProposalCard,
  ProposalCardProps,
  TextWithLink
} from 'components/cards/proposal-card';

export default {
  title: 'Features/Poll',
  component: ProposalCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey', maxWidth: 1024 }}>
        {story()}
      </div>
    )
  ]
} as Meta;

const Template: Story<ProposalCardProps> = (args): JSX.Element => (
  <ProposalCard {...args} />
);

export const SuperCollapsedView = Template.bind({});

SuperCollapsedView.args = {
  type: 'Poll',
  likes: 2,
  variant: 'SuperCollapsed',
  dislikes: 234,
  liked: true,
  disliked: false,
  status: 'Passed',
  children: <span>Should we have our offsite in Madrid, Spain in 2022?</span>
};

export const CollapsedView = Template.bind({});

CollapsedView.args = {
  type: 'Poll',
  likes: 2,
  variant: 'Default',
  title: 'jonathan.near',
  dislikes: 234,
  liked: true,
  disliked: false,
  status: 'Passed',
  children: (
    <TextWithLink
      text="We, Meowsers fund, are committed to bring more cats to our DAO"
      link="http://example.com"
      linkTitle="reddit.com/group"
    />
  )
};
