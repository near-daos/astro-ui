import { render } from 'jest/testUtils';

import { Group } from 'features/vote-policy/components/Group';

describe('Group', () => {
  it('Should render component', () => {
    const { container } = render(<Group name="My Group" />);

    expect(container).toMatchSnapshot();
  });
});
