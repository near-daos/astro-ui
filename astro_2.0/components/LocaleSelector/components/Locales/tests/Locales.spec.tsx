/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { Locales } from 'astro_2.0/components/LocaleSelector/components/Locales';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

describe('Locales', () => {
  it('Should render component', () => {
    const router = {
      locales: ['en', 'ru'],
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { container } = render(<Locales />);

    expect(container).toMatchSnapshot();
  });

  it('Should call router push with proper params on locale button click', () => {
    const router = {
      locales: ['en'],
      push: jest.fn(),
      asPath: '',
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { getByRole } = render(<Locales />);

    fireEvent.click(getByRole('button'));

    expect(router.push).toBeCalledWith('', '', { locale: 'en' });
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
