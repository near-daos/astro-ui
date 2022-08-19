import { render } from 'jest/testUtils';

import { DAO } from 'types/dao';

import { VoteInOtherDao } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/VoteInOtherDao';

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => ({
      watch: () => 1,
      register: () => ({}),
      setValue: () => ({}),
      formState: {
        errors: {},
      },
    })),
  };
});

describe('VoteInOtherDao', () => {
  it('Should render component', () => {
    const dao = {} as unknown as DAO;

    const { getByText } = render(<VoteInOtherDao dao={dao} />);

    expect(getByText('proposalCard.voteInDao.targetDao.label')).toBeTruthy();
  });
});
