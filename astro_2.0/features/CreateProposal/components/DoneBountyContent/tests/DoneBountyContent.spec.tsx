import { render } from 'jest/testUtils';

import { BountyDoneContent } from 'astro_2.0/features/CreateProposal/components/DoneBountyContent';

const formContextMock = {
  register: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

describe('CreateGroupContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<BountyDoneContent />);

    expect(getByText('Target')).toBeTruthy();
  });
});
