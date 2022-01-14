/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { DaoInfoCard } from 'astro_2.0/components/DaoDetails/DaoDetailsGrid/components/DaoInfoCard';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

describe('dao info card', () => {
  it('Should redirect user on button click', () => {
    const router = {
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const url = 'my-url';

    const { getByRole } = render(
      <DaoInfoCard infoType="funds" title="some title" url={url} />
    );

    fireEvent.click(getByRole('button'));

    expect(router.push).toBeCalledWith(url);
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
