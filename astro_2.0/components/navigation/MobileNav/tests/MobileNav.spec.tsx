/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { MobileNav } from 'astro_2.0/components/navigation/MobileNav';
import { useWalletContext } from 'context/WalletContext';

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(),
  };
});

jest.mock('astro_2.0/components/navigation/NavButton', () => {
  return {
    NavButton: ({ label }: { label: string }) => (
      <div data-testid="nav-item">{label}</div>
    ),
  };
});

describe('Mobile nav', () => {
  it('Should render partial navigation if user did not log in', () => {
    // @ts-ignore
    useWalletContext.mockImplementation(() => ({
      accountId: undefined,
    }));

    const { container, getAllByTestId } = render(<MobileNav />);

    expect(container).toMatchSnapshot();
    expect(getAllByTestId('nav-item')).toHaveLength(3);
  });

  it('Should render full navigation for logged user', () => {
    // @ts-ignore
    useWalletContext.mockImplementation(() => ({
      accountId: 'accountId',
    }));

    const { container, getAllByTestId } = render(<MobileNav />);

    expect(container).toMatchSnapshot();
    expect(getAllByTestId('nav-item')).toHaveLength(5);
  });
});
