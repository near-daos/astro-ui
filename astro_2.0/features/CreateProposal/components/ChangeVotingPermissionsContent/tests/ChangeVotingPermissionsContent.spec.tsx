import { render } from 'jest/testUtils';

import { ChangeVotingPermissionsContent } from 'astro_2.0/features/CreateProposal/components/ChangeVotingPermissionsContent';

const formContextMock = {
  watch: () => 0,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock(
  'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/components/PermissionsSelector',
  () => {
    return {
      PermissionsSelector: () => <div>PermissionsSelector</div>,
    };
  }
);

describe('ChangeVotingPermissionsContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<ChangeVotingPermissionsContent />);

    expect(getByText('PermissionsSelector')).toBeTruthy();
  });
});
