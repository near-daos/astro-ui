import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Pagination, PaginationProps } from 'components/Pagination';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  argTypes: {
    onPageChange: {
      action: 'changes',
    },
  },
  decorators: [
    story => (
      <div
        style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}
      >
        {story()}
      </div>
    ),
  ],
} as Meta;

const Template: Story<PaginationProps> = (args): JSX.Element => (
  <Pagination {...args} />
);

export const Default = Template.bind({});

Default.args = {
  pageCount: 99,
  pagesVisible: 1,
  pagesRange: 4,
};
