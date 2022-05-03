/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { CREATE_DAO_URL } from 'constants/routing';

import { useWalletContext } from 'context/WalletContext';

import { DaosList } from 'astro_2.0/components/DaosList';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(() => ({})),
  };
});

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({})),
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

describe('Dao List', () => {
  it('Should render component', () => {
    const { container } = render(<DaosList label="Hello World" />);

    expect(container).toMatchSnapshot();
  });

  it('Should navigate to login if user is not logged', () => {
    const login = jest.fn();

    // @ts-ignore
    useWalletContext.mockImplementation(() => ({ login }));

    const { getByRole } = render(<DaosList label="Hello World" />);

    fireEvent.click(getByRole('button'));

    expect(login).toBeCalled();
  });

  it('Should navigate to "create dao" page for logged user', () => {
    // @ts-ignore
    useWalletContext.mockImplementation(() => ({ accountId: 'accountId' }));

    const router = {
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { getByRole } = render(<DaosList label="Hello World" />);

    fireEvent.click(getByRole('button'));

    expect(router.push).toBeCalledWith(CREATE_DAO_URL);
  });
});
