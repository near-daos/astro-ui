/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { useFormContext } from 'react-hook-form';

import { TemplateRules } from 'astro_2.0/features/CreateDao/components/TemplateRules';

const formContextMock = {
  trigger: () => 0,
  setValue: () => 0,
  getValues: () => ({}),
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock(
  'astro_2.0/features/CreateDao/components/TemplateRules/components/TemplateLink',
  () => {
    return {
      TemplateLink: ({ onClick }: { onClick: () => void }) => (
        <button onClick={onClick} type="button">
          click
        </button>
      ),
    };
  }
);

describe('TemplateRules', () => {
  it('Should update values on link click', () => {
    const trigger = jest.fn();

    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      trigger,
    }));

    const { getAllByRole } = render(<TemplateRules />);

    fireEvent.click(getAllByRole('button')[1]);

    expect(trigger).toBeCalled();
  });
});
