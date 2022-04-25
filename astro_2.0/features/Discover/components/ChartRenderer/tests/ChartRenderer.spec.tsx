import { render } from 'jest/testUtils';

import { ChartRenderer } from 'astro_2.0/features/Discover/components/ChartRenderer';

jest.mock('astro_2.0/features/DaoDashboard/components/DashboardChart', () => {
  return {
    DashboardChart: () => <div>DashboardChart</div>,
  };
});

describe('ChartRenderer', () => {
  it('Should render loader if loading', () => {
    const { getByText } = render(
      <ChartRenderer data={null} loading activeView="view" />
    );

    expect(getByText('This may take some time')).toBeTruthy();
  });

  it('Should render "No Results"', () => {
    const { getByText } = render(
      <ChartRenderer data={null} loading={false} activeView="view" />
    );

    expect(getByText('No data available')).toBeTruthy();
  });

  it('Should render chart', () => {
    const data = [
      {
        x: new Date(),
        y: 1,
      },
    ];

    const { getByText } = render(
      <ChartRenderer data={data} loading={false} activeView="view" />
    );

    expect(getByText('DashboardChart')).toBeTruthy();
  });
});
