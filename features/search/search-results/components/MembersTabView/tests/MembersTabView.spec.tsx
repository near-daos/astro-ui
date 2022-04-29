/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { useModal } from 'components/modal';
import { useSearchResults } from 'features/search/search-results/SearchResults';

import { MembersTabView } from 'features/search/search-results/components/MembersTabView';

jest.mock('react-text-truncate', () => {
  return ({ text }: { text: string }) => <div>{text}</div>;
});

jest.mock('components/modal', () => {
  return {
    useModal: jest.fn(() => []),
  };
});

jest.mock('features/search/search-results/SearchResults', () => {
  return {
    useSearchResults: jest.fn(() => ({})),
  };
});

describe('MembersTabView', () => {
  it('Should "No Data" state', () => {
    const { getByText } = render(<MembersTabView />);

    expect(
      getByText("We couldn't find anything matching your search.", {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it('Should render component', () => {
    const name = 'My Name Is';

    // @ts-ignore
    useSearchResults.mockImplementation(() => ({
      searchResults: {
        members: [
          {
            id: 'N1',
            name,
            groups: ['MEW holders'],
            votes: 0,
          },
        ],
      },
    }));

    const { getByText } = render(<MembersTabView />);

    expect(getByText(name)).toBeInTheDocument();
  });

  it('Should show modal', () => {
    const showModal = jest.fn();

    // @ts-ignore
    useModal.mockImplementation(() => [showModal]);

    // @ts-ignore
    useSearchResults.mockImplementation(() => ({
      searchResults: {
        members: [
          {
            id: 'N1',
            name: 'N1',
            groups: ['MEW holders'],
            votes: 0,
          },
        ],
      },
    }));

    const { getAllByRole } = render(<MembersTabView />);

    fireEvent.click(getAllByRole('button')[0]);

    expect(showModal).toBeCalled();
  });
});
