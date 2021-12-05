import React from 'react';
import { Meta } from '@storybook/react';
import { Select } from 'components/inputs/selects/Select';

export default {
  title: 'Components/Select',
  component: Select,
} as Meta;

const options = [
  {
    label: 'Test 1',
    value: 'test-1',
  },
  {
    label: 'Test 2',
    value: 'test-2',
  },
  {
    label: 'Test 3',
    value: 'test-3',
  },
];

export const Template = (
  args: React.ComponentProps<typeof Select>
): JSX.Element => {
  return (
    <div>
      <style jsx>
        {`
          div {
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Select {...args} />
    </div>
  );
};

Template.storyName = 'Select';

Template.args = {
  size: 'large',
  options,
};
