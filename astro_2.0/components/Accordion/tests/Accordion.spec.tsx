import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { Accordion } from 'astro_2.0/components/Accordion';
import React from 'react';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn(),
  };
});

describe('Accordion', () => {
  it('Should render component', () => {
    const setOpen = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, setOpen]);

    const { container } = render(<Accordion title="Hello">World</Accordion>);

    expect(container).toMatchSnapshot();
  });

  it('Should open accordion', () => {
    const setOpen = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, setOpen]);

    const { getByTestId } = render(<Accordion title="Hello">World</Accordion>);

    fireEvent.click(getByTestId('accordion-header'));

    expect(setOpen).toBeCalledWith(true);
  });
});
