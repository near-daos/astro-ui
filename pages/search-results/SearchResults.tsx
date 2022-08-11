import React, { ReactNode } from 'react';
import { SearchResultsRenderer } from 'features/search/search-results';
import { Page } from 'pages/_app';
import { MainLayout } from 'astro_3.0/features/MainLayout';

const SearchResults: Page = () => {
  return <SearchResultsRenderer />;
};

SearchResults.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default SearchResults;
