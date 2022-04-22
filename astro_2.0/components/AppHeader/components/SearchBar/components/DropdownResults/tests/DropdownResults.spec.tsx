/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { render } from 'jest/testUtils';
import { SEARCH_PAGE_URL } from 'constants/routing';
import { useSearchResults } from 'features/search/search-results';

import { DropdownResults } from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults';

jest.mock('features/search/search-results', () => {
  return {
    useSearchResults: jest.fn(),
  };
});

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

describe('search results dropdown', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Should render component', () => {
    // @ts-ignore
    useSearchResults.mockImplementation(() => ({}));

    const { container } = render(
      <DropdownResults width={100} closeSearch={() => {}} query="asd" />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render search results', () => {
    const daoName = 'dao 1';
    const proposalDescription = 'proposal description';
    const userName = 'Alex';

    // @ts-ignore
    useSearchResults.mockImplementation(() => ({
      searchResults: {
        daos: [{ displayName: daoName }],
        proposals: [{ description: proposalDescription }],
        members: [{ name: userName }],
      },
    }));

    const component = render(
      <DropdownResults width={100} closeSearch={() => {}} query="asd" />
    );

    expect(component.getAllByText(daoName)).toHaveLength(1);
    expect(component.getAllByText(proposalDescription)).toHaveLength(1);
    expect(component.getAllByText(userName)).toHaveLength(1);
  });

  it.each`
    mockData                                           | tab
    ${{ daos: [{ displayName: 'dao 1' }] }}            | ${0}
    ${{ proposals: [{ description: 'description' }] }} | ${1}
    ${{ members: [{ name: 'Alex' }] }}                 | ${2}
  `('Should go to search page, dao tab', ({ mockData, tab }) => {
    const router = {
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    // @ts-ignore
    useSearchResults.mockImplementation(() => ({
      searchResults: mockData,
    }));

    const component = render(
      <DropdownResults width={100} closeSearch={() => {}} query="asd" />
    );

    const seeAllBtn = component.getByText('header.search.seeAll', {
      exact: false,
    });

    fireEvent.click(seeAllBtn);

    expect(router.push).toBeCalled();
    expect(get(router.push, 'mock.calls.0.0')).toStrictEqual({
      pathname: SEARCH_PAGE_URL,
      query: { tab },
    });
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
