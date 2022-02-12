import { render } from 'jest/testUtils';

import { TokenWidget } from 'astro_2.0/components/TokenWidget';

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

describe('Token widget', () => {
  it('Should render component', () => {
    const { container } = render(
      <TokenWidget amount="10" icon="icon" symbol="NEAR" decimals={10} noIcon />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render NEAR icon', () => {
    const { getAllByText } = render(
      <TokenWidget amount="10" icon="icon" symbol="NEAR" decimals={10} />
    );

    expect(getAllByText('iconNear')).toHaveLength(1);
  });

  it('Should render valid icon', () => {
    const { container } = render(
      <TokenWidget amount="10" icon="validIcon" symbol="HI" decimals={10} />
    );

    expect(container).toMatchSnapshot();
  });
});
