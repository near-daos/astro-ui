/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { useDaoDashboardData } from 'astro_2.0/features/DaoDashboard/hooks';

import { DaoDashboard } from 'astro_2.0/features/DaoDashboard';

import { DaoContext } from 'types/context';

import { chartData, dashboardData } from './mock';

jest.mock('astro_2.0/features/DaoDashboard/hooks', () => {
  return {
    useDaoDashboardData: jest.fn(),
  };
});

jest.mock('date-fns', () => {
  return {
    ...jest.requireActual('date-fns'),
    format: (date: string) => date,
  };
});

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('DaoDashboard', () => {
  const daoContext = { dao: { id: '1' } } as DaoContext;

  it('Should render component', () => {
    // @ts-ignore
    useDaoDashboardData.mockImplementation(() => ({
      chartData,
      dashboardData,
      activeView: 'DAO_FUNDS',
      toggleView: () => 0,
      loading: false,
    }));

    const { getByText } = render(<DaoDashboard daoContext={daoContext} />);

    expect(getByText('daoDashboard.bounties')).toBeTruthy();
  });

  it('Should render loader if data is loading', () => {
    // @ts-ignore
    useDaoDashboardData.mockImplementation(() => ({
      dashboardData,
      activeView: 'DAO_FUNDS',
      toggleView: () => 0,
      loading: true,
    }));

    const { getByText } = render(<DaoDashboard daoContext={daoContext} />);

    expect(getByText('This may take some time')).toBeTruthy();
  });

  it('Should render "No Data"', () => {
    // @ts-ignore
    useDaoDashboardData.mockImplementation(() => ({
      dashboardData,
      activeView: 'DAO_FUNDS',
      toggleView: () => 0,
      loading: false,
    }));

    const { getByText } = render(<DaoDashboard daoContext={daoContext} />);

    expect(getByText('No data available')).toBeTruthy();
  });

  it.each`
    index | view
    ${0}  | ${'DAO_FUNDS'}
    ${1}  | ${'BOUNTIES'}
    ${2}  | ${'NFTS'}
    ${3}  | ${'PROPOSALS'}
  `('Should toggle view to $view', ({ index, view }) => {
    const toggleView = jest.fn();

    // @ts-ignore
    useDaoDashboardData.mockImplementation(() => ({
      chartData,
      dashboardData,
      activeView: 'DAO_FUNDS',
      toggleView,
      loading: false,
    }));

    const { getAllByTestId } = render(<DaoDashboard daoContext={daoContext} />);

    fireEvent.click(getAllByTestId('stat-card')[index]);

    expect(toggleView).toBeCalledWith(view);
  });
});
