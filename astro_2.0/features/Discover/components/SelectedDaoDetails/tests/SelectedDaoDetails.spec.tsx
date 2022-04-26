/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useRouter } from 'next/router';
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { act, screen } from '@testing-library/react';

import { SINGLE_DAO_PAGE } from 'constants/routing';

import useQuery from 'hooks/useQuery';

import { SputnikHttpService } from 'services/sputnik';

import { SelectedDaoDetails } from 'astro_2.0/features/Discover/components/SelectedDaoDetails';

import { daoMock } from './mock';

jest.mock('hooks/useQuery', () => {
  return jest.fn(() => ({
    query: {},
  }));
});

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

describe('SelectedDaoDetails', () => {
  it('Should render nothing if no data', () => {
    const { container } = render(<SelectedDaoDetails />);

    expect(container).toMatchSnapshot();
  });

  it('Should render component', async () => {
    // @ts-ignore
    useQuery.mockImplementation(() => ({
      query: {
        dao: '123',
      },
    }));

    jest
      .spyOn(SputnikHttpService, 'getDaoById')
      .mockImplementationOnce(() => Promise.resolve(daoMock));

    await act(async () => {
      render(<SelectedDaoDetails />);
    });

    expect(screen.getByText('Go to DAO page')).toBeInTheDocument();
  });

  it('Should navigate to dao page', async () => {
    // @ts-ignore
    useQuery.mockImplementation(() => ({
      query: {
        dao: '123',
      },
    }));

    const router = {
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    jest
      .spyOn(SputnikHttpService, 'getDaoById')
      .mockImplementationOnce(() => Promise.resolve(daoMock));

    await act(async () => {
      render(<SelectedDaoDetails />);
    });

    fireEvent.click(screen.getAllByRole('button')[3]);

    expect(router.push).toBeCalledWith({
      pathname: SINGLE_DAO_PAGE,
      query: {
        dao: 'default-flag-test.sputnikv2.testnet',
      },
    });
  });

  it('Should properly handle close icon click', async () => {
    const updateQuery = jest.fn();

    // @ts-ignore
    useQuery.mockImplementation(() => ({
      query: {
        dao: '123',
      },
      updateQuery,
    }));

    jest
      .spyOn(SputnikHttpService, 'getDaoById')
      .mockImplementationOnce(() => Promise.resolve(daoMock));

    await act(async () => {
      render(<SelectedDaoDetails />);
    });

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(updateQuery).toBeCalledWith('dao', '');
  });
});
