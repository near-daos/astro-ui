import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { DaoSetting } from 'astro_2.0/features/DaoGovernance';

describe('DaoSetting', () => {
  it('Should trigger setting change callback', () => {
    const settingsChangeHandler = jest.fn();

    const { getByRole } = render(
      <DaoSetting
        settingsName="HelloWorld"
        settingsChangeHandler={settingsChangeHandler}
      />
    );

    fireEvent.click(getByRole('button'));

    expect(settingsChangeHandler).toBeCalled();
  });
});
