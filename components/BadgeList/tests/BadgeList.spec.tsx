import { render } from 'jest/testUtils';

import { BadgeList } from 'components/BadgeList';

describe('Badge List', () => {
  it('Should render component', () => {
    const items = [
      {
        label: 'Hello',
        component: <div>Hello</div>,
      },
      {
        label: 'World',
        component: <div>World</div>,
      },
    ];

    const { container } = render(
      <BadgeList selectedItems={items} showPlaceholder />
    );

    expect(container).toMatchSnapshot();
  });
});
