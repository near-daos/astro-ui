import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  SearchFilters,
  SearchFiltersProps
} from 'features/search/search-filters';

export default {
  title: 'Features/Search/SearchFilters',
  component: SearchFilters,
  decorators: [
    story => (
      <div style={{ padding: '1rem', background: '#f7f5fc', maxWidth: 768 }}>
        {story()}
      </div>
    )
  ]
} as Meta;

export const Template: Story<SearchFiltersProps> = (args): JSX.Element => (
  <SearchFilters {...args} />
);

Template.storyName = 'SearchFilters';
Template.args = {
  projectName: 'community project'
};
