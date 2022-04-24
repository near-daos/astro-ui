import { render } from 'jest/testUtils';

import { DisconnectButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/DisconnectButton';

describe('DisconnectButton', () => {
  it('Should render component', () => {
    const { getByText } = render(<DisconnectButton logout={() => 0} />);

    expect(getByText('header.disconnect')).toBeTruthy();
  });
});
