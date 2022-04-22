/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { DaoFeedItem } from 'types/dao';
import { render } from 'jest/testUtils';
import { SINGLE_DAO_PAGE } from 'constants/routing';

import { SearchResultDaoCard } from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults/components/ResultSection/components/SearchResultDaoCard';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

describe('search result dao card', () => {
  it('Should render component', () => {
    const dao = { id: 'dao id' } as DaoFeedItem;

    const { container } = render(
      <SearchResultDaoCard data={dao} onClick={() => {}} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should call onClick callback and navigate user to dao page', () => {
    const router = {
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const onClick = jest.fn();

    const daoId = 'daoId';
    const dao = { id: daoId } as DaoFeedItem;

    const component = render(
      <SearchResultDaoCard data={dao} onClick={onClick} />
    );

    fireEvent.click(component.getByRole('button'));

    expect(onClick).toBeCalled();

    expect(router.push).toBeCalled();
    expect(get(router.push, 'mock.calls.0.0')).toStrictEqual({
      pathname: SINGLE_DAO_PAGE,
      query: { dao: daoId },
    });
  });
});
/* eslint-enable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-function */
