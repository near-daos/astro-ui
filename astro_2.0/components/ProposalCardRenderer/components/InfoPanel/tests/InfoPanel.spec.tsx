/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from 'react';
import { render } from 'jest/testUtils';
import { useMountedState } from 'react-use';
import { fireEvent } from '@testing-library/dom';

import { InfoPanel } from 'astro_2.0/components/ProposalCardRenderer/components/InfoPanel';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn(),
  };
});

jest.mock('react-use', () => ({
  useMountedState: jest.fn(),
}));

describe('info panel', () => {
  it('Should set "open" to true', () => {
    const setOpen = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setOpen]);

    const { getByTestId } = render(<InfoPanel />);

    fireEvent.mouseOver(getByTestId('hover-el'));

    expect(setOpen).toBeCalledWith(true);
  });

  it('Should set "open" to false', () => {
    const setOpen = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setOpen]);

    const { getByTestId } = render(<InfoPanel />);

    fireEvent.mouseOut(getByTestId('hover-el'));

    expect(setOpen).toBeCalledWith(false);
  });

  it('Should set "open" to false when mounted', () => {
    // @ts-ignore
    useMountedState.mockImplementationOnce(() => () => true);

    jest.useFakeTimers();

    const setOpen = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setOpen]);

    render(<InfoPanel />);

    jest.runAllTimers();

    expect(setOpen).toBeCalledWith(false);
  });

  it('Should not call setOpen if component did not mount', () => {
    // @ts-ignore
    useMountedState.mockImplementationOnce(() => () => false);

    jest.useFakeTimers();

    const setOpen = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, setOpen]);

    render(<InfoPanel />);

    jest.runAllTimers();

    expect(setOpen).not.toBeCalled();
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
