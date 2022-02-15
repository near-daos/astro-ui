import React from 'react';
import { Badge } from 'components/Badge';
import { Meta } from '@storybook/react';

export default {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    background: { type: 'string' },
    label: { type: 'string' },
  },
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof Badge> & { label: string }
): JSX.Element => {
  const { label } = args;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Badge {...args}>{label}</Badge>
      <Badge size="small" variant="primary">
        99+
      </Badge>
      <Badge
        size="large"
        textTransform="uppercase"
        background="var(--color-brand-neon-yellow)"
      >
        45 Active proposals
      </Badge>
    </div>
  );
};

Template.storyName = 'Badge';
Template.args = {
  variant: 'blue',
  size: 'medium',
  label: 'Group Name',
};
