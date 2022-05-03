import { render } from 'jest/testUtils';

import { NoSearchResultsView } from 'features/search/search-results/components/NoSearchResultsView';

describe('NoSearchResultsView', () => {
  it('Should render "No results"', () => {
    const { getByText } = render(<NoSearchResultsView />);

    expect(getByText('No results')).toBeInTheDocument();
  });

  it('Should render "No results" with query', () => {
    const query = 'Hello World!';

    const { getByText } = render(<NoSearchResultsView query={query} />);

    expect(getByText(`No results for ${query}`)).toBeInTheDocument();
  });
});
