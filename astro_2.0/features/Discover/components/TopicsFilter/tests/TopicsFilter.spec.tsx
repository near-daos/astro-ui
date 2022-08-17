import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { TopicsFilter } from 'astro_2.0/features/Discover/components/TopicsFilter';

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(() => true),
  };
});

describe('TopicsFilter', () => {
  it('Should render overview side bar', () => {
    const { getByText } = render(<TopicsFilter />);

    expect(getByText('discover.usersAndActivity')).toBeInTheDocument();
  });

  it('Should render financial side bar', () => {
    const { getByText } = render(<TopicsFilter />);

    fireEvent.click(getByText('discover.financial'));

    expect(getByText('discover.tokens')).toBeInTheDocument();
  });
});
