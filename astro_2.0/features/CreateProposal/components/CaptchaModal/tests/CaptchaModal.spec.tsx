/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { PuzzleCaptcha } from 'astro_2.0/components/PuzzleCaptcha';
import { CaptchaModal } from 'astro_2.0/features/CreateProposal/components/CaptchaModal';
import { fireEvent } from '@testing-library/dom';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
  };
});

jest.mock('utils/getRandomInt', () => {
  return {
    getRandomInt: () => 1,
  };
});

jest.mock('astro_2.0/components/PuzzleCaptcha', () => {
  // eslint-disable-next-line
  const { PuzzleCaptcha } = jest.requireActual(
    'astro_2.0/components/PuzzleCaptcha'
  );

  return {
    PuzzleCaptcha: jest.fn(PuzzleCaptcha),
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

describe('CaptchaModal', () => {
  it('Should render component', () => {
    const { container } = render(<CaptchaModal isOpen onClose={() => 0} />);

    expect(container).toMatchSnapshot();
  });

  it('Should call onClose callback', () => {
    // @ts-ignore
    PuzzleCaptcha.mockImplementation(
      ({ onCaptchaDone }: { onCaptchaDone: (arg: boolean) => void }) => (
        // eslint-disable-next-line
        <div onClick={() => onCaptchaDone(true)}>PuzzleCaptcha</div>
      )
    );

    const onClose = jest.fn();

    const { getByText } = render(<CaptchaModal isOpen onClose={onClose} />);

    fireEvent.click(getByText('PuzzleCaptcha'));

    expect(onClose).toBeCalled();
  });

  it('Should NOT call onClose callback', () => {
    // @ts-ignore
    PuzzleCaptcha.mockImplementation(
      ({ onCaptchaDone }: { onCaptchaDone: (arg: boolean) => void }) => (
        // eslint-disable-next-line
        <div onClick={() => onCaptchaDone(false)}>PuzzleCaptcha</div>
      )
    );

    const onClose = jest.fn();

    const { getByText } = render(<CaptchaModal isOpen onClose={onClose} />);

    fireEvent.click(getByText('PuzzleCaptcha'));

    expect(onClose).toBeCalledTimes(0);
  });
});
