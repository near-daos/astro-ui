import { render } from 'jest/testUtils';

import { AmountContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/AmountContent';

import { tokens } from './mock';

jest.mock('astro_2.0/components/LoadingIndicator', () => {
  return {
    LoadingIndicator: () => <div>Loading...</div>,
  };
});

jest.mock('hooks/useIsValidImage', () => {
  return {
    useIsValidImage: () => true,
  };
});

describe('AmountContent', () => {
  it('Should render component', () => {
    const { container } = render(
      <AmountContent amount="12" token="NEAR" tokens={tokens} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render loading indicator if no token data', () => {
    const { getByText } = render(
      <AmountContent amount="12" token="hey" tokens={tokens} />
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('Should render custom token icon', () => {
    const localTokens = {
      NEAR: {
        ...tokens.NEAR,
      },
    };

    localTokens.NEAR.symbol = '';

    const { getByTestId } = render(
      <AmountContent amount="12" token="NEAR" tokens={localTokens} />
    );

    expect(getByTestId('custom-icon')).toBeTruthy();
  });
});
