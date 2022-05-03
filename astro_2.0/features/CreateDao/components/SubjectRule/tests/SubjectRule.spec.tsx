/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ReactNode } from 'react';
import { render } from 'jest/testUtils';

import { useFormContext } from 'react-hook-form';

import { SubjectRule } from 'astro_2.0/features/CreateDao/components/SubjectRule';
import { fireEvent } from '@testing-library/dom';

const formContextMock = {
  trigger: () => 0,
  formState: {
    errors: {},
    touchedFields: {},
  },
};

jest.mock('react-hook-form', () => {
  return {
    ...jest.requireActual('react-hook-form'),
    // eslint-disable-next-line @typescript-eslint/no-shadow
    Controller: ({ render }: { render: (data: unknown) => ReactNode }) => {
      const renderProps = {
        field: {
          value: '123',
          onChange: () => 0,
        },
      };

      return <div>{render(renderProps)}</div>;
    },
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

describe('SubjectRule', () => {
  it('Should render component', () => {
    const title = 'Hello World';

    const { getByText } = render(
      <SubjectRule title={title} subTitle="Subtitle" subject="proposals" />
    );

    expect(getByText(title)).toBeTruthy();
  });

  it('Should handle dao option change', () => {
    const subject = 'proposals';

    const trigger = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      trigger,
    }));

    const { getAllByRole } = render(
      <SubjectRule title="Hello World" subTitle="Subtitle" subject={subject} />
    );

    fireEvent.click(getAllByRole('button')[0]);

    expect(trigger).toBeCalledWith(subject);
  });
});
