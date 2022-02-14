/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from 'react';

import { useRadioContext } from 'astro_2.0/components/inputs/radio/Radio/hooks';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useContext: jest.fn(),
  };
});

describe('useRadioContext', () => {
  it('Should return context when available', () => {
    const contextMock = 'Hello World';

    // @ts-ignore
    useContext.mockImplementation(() => contextMock);

    const context = useRadioContext();

    expect(context).toStrictEqual(contextMock);
  });

  it('Should throw error if no context found', () => {
    // @ts-ignore
    useContext.mockImplementation(() => undefined);

    expect(() => useRadioContext()).toThrow();
  });
});
