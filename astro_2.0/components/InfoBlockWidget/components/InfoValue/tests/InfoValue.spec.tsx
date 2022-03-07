import { render } from 'jest/testUtils';

import { InfoValue } from 'astro_2.0/components/InfoBlockWidget/components/InfoValue';

describe('InfoValue', () => {
  it('Should render value and label component', () => {
    const value = 'value';
    const label = 'label';

    const { getByText } = render(<InfoValue value={value} label={label} />);

    expect(getByText(value)).toBeTruthy();
    expect(getByText(label)).toBeTruthy();
  });
});
