import React, { ReactNode } from 'react';
import { fireEvent } from '@testing-library/dom';

import { render } from 'jest/testUtils';

import { TimelineLegend } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineLegend';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn(),
  };
});

jest.mock('framer-motion', () => {
  return {
    AnimatePresence: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    motion: {
      div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    },
  };
});

describe('TimelineHeader', () => {
  it('Should render component', () => {
    const setOpen = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setOpen]);

    const { container } = render(<TimelineLegend />);

    expect(container).toMatchSnapshot();
  });

  it('Should toggle "open" state', () => {
    const setOpen = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setOpen]);

    const { getByRole } = render(<TimelineLegend />);

    fireEvent.click(getByRole('button'));

    expect(setOpen).toBeCalledWith(false);
  });
});
