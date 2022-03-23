import React from 'react';
import { fireEvent } from '@testing-library/dom';

import { render } from 'jest/testUtils';

import { DaoLinksForm } from 'astro_2.0/features/CreateDao/components/DaoLinksForm';

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook does not generate warnings in console
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn(),
  };
});

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => ({
      setValue: () => 0,
      getValues: (key: string) => {
        if (!key) {
          return 0;
        }

        return [];
      },
      formState: {
        touchedFields: {},
      },
      register: () => 0,
    })),
  };
});

jest.mock('utils/getSocialLinkIcon', () => {
  return {
    getSocialLinkIcon: () => 'aAllDaos',
  };
});

jest.mock('@reach/auto-id', () => {
  return {
    useId: () => 0,
  };
});

describe('DaoLinksForm', () => {
  it('Should add link', () => {
    const setLinksCount = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [0, setLinksCount]);

    const { getByRole } = render(<DaoLinksForm />);

    fireEvent.click(getByRole('button'));

    expect(setLinksCount).toBeCalled();
    expect(setLinksCount.mock.calls[0][0](1)).toEqual(2);
  });

  it('Should remove link', () => {
    const setLinksCount = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [1, setLinksCount]);

    const { getAllByRole } = render(<DaoLinksForm />);

    fireEvent.click(getAllByRole('button')[0]);

    expect(setLinksCount).toBeCalled();
    expect(setLinksCount.mock.calls[0][0](2)).toEqual(1);
  });
});
