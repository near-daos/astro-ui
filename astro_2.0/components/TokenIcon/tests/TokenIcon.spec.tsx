import { render } from 'jest/testUtils';

import { TokenIcon } from 'astro_2.0/components/TokenIcon';

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => (
      <div data-testid="c-icon">{name}</div>
    ),
  };
});

jest.mock('hooks/useIsValidImage', () => {
  return {
    useIsValidImage: () => true,
  };
});

describe('Token icon', () => {
  it('Should render component', () => {
    const { container } = render(<TokenIcon symbol="random" icon="myIcon" />);

    expect(container).toMatchSnapshot();
  });

  it.each`
    symbol      | icon
    ${'near'}   | ${'tokenNearBig'}
    ${'wnear'}  | ${'tokenNearBig'}
    ${'aurora'} | ${'aurora'}
  `('Should render proper icon for $symbol symbol', ({ symbol, icon }) => {
    const { getAllByText } = render(<TokenIcon symbol={symbol} icon="" />);

    expect(getAllByText(icon)).toHaveLength(1);
  });
});
