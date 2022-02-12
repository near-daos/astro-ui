import { render } from 'jest/testUtils';

import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';

describe('Radio group', () => {
  it('Should render component', () => {
    const { container } = render(
      <RadioGroup value="Hello" onChange={() => 0}>
        <div>We Are Group</div>
      </RadioGroup>
    );

    expect(container).toMatchSnapshot();
  });
});
