import { render } from 'jest/testUtils';

import { ChartLegend } from 'astro_2.0/features/DaoDashboard/components/DashboardChart/components/ChartLegend/ChartLegend';

describe('Comment', () => {
  it('Should render Comment component', () => {
    const { container } = render(
      <ChartLegend label="DAO funds" className="indicatorClassName" />
    );

    expect(container).toMatchSnapshot();
  });
});
