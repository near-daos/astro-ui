/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { FieldError } from 'react-hook-form';

import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

describe('InputFormWrapper', () => {
  it('Should render errors', () => {
    const name = 'hello';
    const message = 'Hello World!';

    // @ts-ignore
    const component = <div name={name} />;

    const errors = {
      [name]: {
        message,
      } as FieldError,
    };

    const { getByText } = render(
      <InputFormWrapper component={component} errors={errors} />
    );

    expect(getByText(message)).toBeTruthy();
  });
});
