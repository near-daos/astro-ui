/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import useQuery from 'hooks/useQuery';

import { TopListItem } from 'astro_2.0/features/Discover/components/DaosTopList/components/TopListItem';

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(),
  };
});

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

jest.mock('hooks/useQuery', () => {
  return jest.fn(() => ({}));
});

describe('TopListItem', () => {
  it('Should render component', () => {
    const growth = 10;

    const data = {
      dao: 'My DAO',
      overview: [],
      activity: {
        growth,
        count: 0,
      },
    };

    const { getByText } = render(<TopListItem index={1} data={data} />);

    expect(getByText('10%')).toBeTruthy();
  });

  it('Should render proper negative trend icon', () => {
    const data = {
      dao: 'My DAO',
      overview: [],
      activity: {
        growth: -10,
        count: 0,
      },
    };

    const { getByText } = render(<TopListItem index={1} data={data} />);

    expect(getByText('buttonArrowDown')).toBeTruthy();
  });

  it('Should render component without activity info', () => {
    const data = {
      dao: 'My DAO',
      overview: [],
    };

    render(<TopListItem index={1} data={data} />);
  });

  it('Should update query on click', () => {
    const dao = 'My DAO';
    const updateQuery = jest.fn();

    // @ts-ignore
    useQuery.mockImplementation(() => ({ updateQuery }));

    const data = {
      dao,
      overview: [],
    };

    const { getAllByRole } = render(<TopListItem index={1} data={data} />);

    fireEvent.click(getAllByRole('button')[0]);

    expect(updateQuery).toBeCalledWith('dao', dao);
  });
});
