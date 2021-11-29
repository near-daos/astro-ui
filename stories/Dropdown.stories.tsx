import React from 'react';
import { Meta } from '@storybook/react';
import { Dropdown } from 'components/Dropdown';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
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
  args: React.ComponentProps<typeof Dropdown>
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
      <Dropdown {...args} />
    </div>
  );
};

Template.storyName = 'Dropdown';

Template.args = {
  options,
  defaultValue: 'test-1',
};
