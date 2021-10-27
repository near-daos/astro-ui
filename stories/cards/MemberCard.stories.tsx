import React from 'react';
import { Meta, Story } from '@storybook/react';
import MemberCard, { MemberCardProps } from 'components/cards/member-card';
import { Badge } from 'components/badge/Badge';

export default {
  title: 'Components/Cards/MemberCard',
  component: MemberCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    ),
  ],
} as Meta;

const Template: Story<MemberCardProps> = (args): JSX.Element => (
  <MemberCard {...args}>
    <Badge size="small" variant="green">
      Atos
    </Badge>
    <Badge size="large" variant="orange">
      Portos
    </Badge>
    <Badge size="medium">Aramis</Badge>
    <Badge size="medium" variant="turqoise">
      d&apos;Artagnan
    </Badge>
  </MemberCard>
);

export const Default = Template.bind({});

Default.args = {
  title: 'jonasteam.near',
  votes: 23,
  tokens: {
    value: 5,
    type: 'MEW',
    percent: 11.5,
  },
};

export const WithoutTokens = Template.bind({});

WithoutTokens.args = {
  title: 'jonasteam.near',
  votes: 23,
};
