import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { TimelineGroup } from 'astro_2.0/features/Bounties/components/BountiesTimeline/types';

import { TimelineGroups } from 'astro_2.0/features/Bounties/components/BountiesTimeline/components/TimelineGroups';

describe('TimelineGroups', () => {
  const groupId = 'g1';

  const dataset = [
    {
      id: groupId,
      isOpen: true,
      name: 'Group 1',
      claims: [
        {
          id: 'c1',
          title: 'Claim 1',
        },
      ],
    },
  ] as TimelineGroup[];

  it('Should render component', () => {
    const { container } = render(
      <TimelineGroups dataset={dataset} toggleGroup={() => 0} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should call toggleGroup on click', () => {
    const toggleGroup = jest.fn();

    const { getByRole } = render(
      <TimelineGroups dataset={dataset} toggleGroup={toggleGroup} />
    );

    fireEvent.click(getByRole('button'));

    expect(toggleGroup).toBeCalledWith(groupId);
  });

  it('Should call toggleGroup on key press', () => {
    const toggleGroup = jest.fn();

    const { getByRole } = render(
      <TimelineGroups dataset={dataset} toggleGroup={toggleGroup} />
    );

    fireEvent.keyPress(getByRole('button'), {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(toggleGroup).toBeCalledWith(groupId);
  });
});
