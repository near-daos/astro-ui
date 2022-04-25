import { render } from 'jest/testUtils';

import { GroupsRenderer } from 'components/cards/member-card/GroupsRenderer';

describe('GroupsRenderer', () => {
  it('Should render component', () => {
    const selectedItems = [
      {
        label: 'L1',
        component: <div>L1</div>,
      },
      {
        label: 'L2',
        component: <div>L2</div>,
      },
    ];

    const { getAllByText } = render(
      <GroupsRenderer selectedItems={selectedItems} />
    );

    expect(getAllByText('L1')).toBeTruthy();
    expect(getAllByText('L2')).toBeTruthy();
  });
});
