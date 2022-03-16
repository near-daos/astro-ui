import { render } from 'jest/testUtils';

import { DaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/components/DaoAddress';

describe('DaoAddress', () => {
  jest.useFakeTimers();

  it('Should render display name', () => {
    const { getByText } = render(
      <DaoAddress displayName="hello world" onChange={() => 0} />
    );

    expect(getByText('hello-world', { exact: false })).toBeTruthy();
  });

  it('Should call onChange callback', () => {
    const onChange = jest.fn();

    render(<DaoAddress displayName="hello world" onChange={onChange} />);

    jest.runAllTimers();

    expect(onChange).toBeCalledWith({ target: { value: 'hello-world' } });
  });
});
