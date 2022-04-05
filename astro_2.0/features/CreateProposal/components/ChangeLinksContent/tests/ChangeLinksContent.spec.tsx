/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ReactNode } from 'react';
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ChangeLinksContent } from 'astro_2.0/features/CreateProposal/components/ChangeLinksContent';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => 0,
  trigger: () => 0,
  register: () => 0,
};

const fieldArrayMock = {
  fields: [{ id: 1 }],
  append: () => 0,
  remove: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFieldArray: jest.fn(() => fieldArrayMock),
    useFormContext: jest.fn(() => formContextMock),
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

jest.mock('utils/getSocialLinkIcon', () => {
  return {
    getSocialLinkIcon: () => 'socialAnyUrl',
  };
});

jest.mock('components/Popup', () => {
  return {
    Popup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

describe('ChangeDaoNameContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<ChangeLinksContent daoId="123" />);

    expect(getByText('proposalCard.proposalTarget')).toBeTruthy();
  });

  it('Should render error message if errors available', () => {
    const errorMessage = 'some message';

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      formState: {
        errors: {
          'links[0].url': {
            message: errorMessage,
          },
        },
        touchedFields: {},
      },
    }));

    const { getByText } = render(<ChangeLinksContent daoId="123" />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('Should call "remove"', () => {
    const remove = jest.fn();

    // @ts-ignore
    useFieldArray.mockImplementation(() => ({
      ...fieldArrayMock,
      remove,
    }));

    const { getAllByRole } = render(<ChangeLinksContent daoId="123" />);

    fireEvent.click(getAllByRole('button')[0]);

    expect(remove).toBeCalledWith(0);
  });

  it('Should call "append"', () => {
    const append = jest.fn();

    // @ts-ignore
    useFieldArray.mockImplementation(() => ({
      ...fieldArrayMock,
      append,
    }));

    const { getAllByRole } = render(<ChangeLinksContent daoId="123" />);

    fireEvent.click(getAllByRole('button')[1]);

    expect(append).toBeCalled();
  });
});
