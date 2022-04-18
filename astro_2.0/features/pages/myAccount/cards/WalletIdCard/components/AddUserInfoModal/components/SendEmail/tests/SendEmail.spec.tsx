import { render } from 'jest/testUtils';

import { SendEmail } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard/components/AddUserInfoModal/components/SendEmail';

describe('SendEmail', () => {
  it('Should render time left', () => {
    const { getByText } = render(<SendEmail tBase="" timeLeft={2000} />);

    expect(getByText('2 .seconds')).toBeTruthy();
  });

  it('Should render send button', () => {
    const { getByText } = render(<SendEmail tBase="" timeLeft={0} />);

    expect(getByText('.send')).toBeTruthy();
  });
});
