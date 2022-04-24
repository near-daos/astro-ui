import { render } from 'jest/testUtils';

import { CreationProgress } from 'astro_2.0/components/CreationProgress';

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(() => true),
  };
});

jest.mock('../components/CreationProgressStep', () => {
  return {
    CreationProgressStep: ({
      label,
      className,
    }: {
      label: string;
      className: string;
    }) => <div className={className}>{label}</div>,
  };
});

describe('CreationProgress', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, func-names
  window.HTMLElement.prototype.scrollIntoView = function () {};

  it('Should render component', () => {
    const steps = [
      {
        label: 'L1',
        isCurrent: true,
      },
      {
        label: 'L2',
      },
    ];

    const { getByText } = render(<CreationProgress steps={steps} />);

    expect(getByText('L1')).toBeTruthy();
    expect(getByText('L2')).toBeTruthy();
  });
});
