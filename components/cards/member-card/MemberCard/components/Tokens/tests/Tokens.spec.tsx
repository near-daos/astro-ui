import { render } from 'jest/testUtils';

import { Tokens } from 'components/cards/member-card/MemberCard/components/Tokens';

describe('Tokens', () => {
  it('Should render nothing if no data', () => {
    const { container } = render(<Tokens />);

    expect(container).toMatchSnapshot();
  });

  it('Should render component', () => {
    const value = 10;
    const symbol = 'NEAR';

    const token = {
      symbol,
      value,
    };

    const { getByText } = render(<Tokens data={token} />);

    expect(getByText(`${value} ${symbol}`)).toBeTruthy();
  });
});
