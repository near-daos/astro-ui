/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { useWalletContext } from 'context/WalletContext';

import {
  NavButton,
  NavButtonProps,
} from 'astro_2.0/components/navigation/NavButton';

jest.mock('next/router', () => {
  return {
    ...jest.requireActual('next/router'),
    useRouter: jest.fn(() => ({
      query: {},
    })),
  };
});

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({})),
  };
});

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

describe('Nav button', () => {
  function renderNavButton(props?: Partial<NavButtonProps>) {
    return render(
      <NavButton
        myDaosIds={[]}
        icon="aAllDaos"
        hoverIcon="aAllDaosHover"
        href="somehref"
        label="Hello World"
        {...props}
      />
    );
  }

  it('Should render component', () => {
    const { container } = renderNavButton();

    expect(container).toMatchSnapshot();
  });

  it('Should navigate on click without authentication and when auth not required', () => {
    const href = 'helloWorld';

    const router = {
      query: {},
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { getByRole } = renderNavButton({ href });

    fireEvent.click(getByRole('button'));

    expect(router.push).toBeCalledWith(href);
  });

  it('Should call login if navigation requires logged user and user is not logged', () => {
    const login = jest.fn();

    // @ts-ignore
    useWalletContext.mockImplementation(() => ({ login }));

    const { getByRole } = renderNavButton({ authRequired: true });

    fireEvent.click(getByRole('button'));

    expect(login).toBeCalled();
  });

  it('Should render "hover" icon on hover', () => {
    const { getByRole, getAllByText } = renderNavButton({ authRequired: true });

    fireEvent.mouseOver(getByRole('button'));

    expect(getAllByText('aAllDaosHover')).toHaveLength(1);
  });
});
