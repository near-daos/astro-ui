import React from 'react';
import DaoCard from 'components/cards/dao-card/DaoCard';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/cards/DaoCard',
  component: DaoCard,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: 'lightgrey' }}>{story()}</div>
    )
  ]
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof DaoCard>
): JSX.Element => (
  <>
    <DaoCard {...args} />
  </>
);

Template.storyName = 'DaoCard';
Template.args = {
  label: 'DaoCard',
  title: 'Createbase Community',
  url: 'proart.sputnikdao.near',
  description:
    'We’re a collective helping digital artists all around  the  world.',
  activeProposals: 46,
  members: 145,
  funds: 23553
};
