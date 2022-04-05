import { render } from 'jest/testUtils';

import { DaoAddress } from 'astro_2.0/features/CreateDao/components/DaoNameForm/components/DaoAddress';

jest.mock('astro_2.0/features/CreateDao/helpers', () => ({
  validateDaoAddress: jest.fn().mockResolvedValue(false),
}));

describe('DaoAddress', () => {
  it('Should render display name', () => {
    const { getByText } = render(
      <DaoAddress displayName="hello world" onChange={() => 0} />
    );

    expect(getByText('hello-world', { exact: false })).toBeTruthy();
  });

  it('Should call onChange callback', async () => {
    const onChange = jest.fn();

    render(<DaoAddress displayName="hello world" onChange={onChange} />);

    await new Promise(resolve => setTimeout(resolve, 500));

    expect(onChange).toBeCalledWith('hello-world');
  });
});
