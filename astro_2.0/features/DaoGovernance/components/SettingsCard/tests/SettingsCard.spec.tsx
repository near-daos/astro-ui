import { render } from 'jest/testUtils';

import { SettingsCard } from 'astro_2.0/features/DaoGovernance';

describe('SettingsCard', () => {
  it('Should render component', () => {
    const settings = [{ label: 'L1', value: 'V1' }];

    const { getByText } = render(
      <SettingsCard settingName="SettingName" settings={settings} />
    );

    expect(getByText('L1')).toBeTruthy();
  });
});
