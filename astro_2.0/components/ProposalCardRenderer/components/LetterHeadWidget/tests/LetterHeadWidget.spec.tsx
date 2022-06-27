import { render } from 'jest/testUtils';

import { ProposalType } from 'types/proposal';

import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

describe('letter head widget', () => {
  it.each`
    type                                 | icon
    ${ProposalType.AddMemberToRole}      | ${'proposalAddMember'}
    ${ProposalType.RemoveMemberFromRole} | ${'proposalRemoveMember'}
    ${ProposalType.BountyDone}           | ${'proposalBounty'}
    ${ProposalType.AddBounty}            | ${'proposalBounty'}
    ${ProposalType.Transfer}             | ${'proposalSendFunds'}
    ${ProposalType.Vote}                 | ${'proposalPoll'}
    ${ProposalType.ChangePolicy}         | ${'proposalGovernance'}
    ${ProposalType.FunctionCall}         | ${'proposalFunctionCall'}
  `('Should render $icon for $type proposal type', ({ type, icon }) => {
    const { getAllByText } = render(<LetterHeadWidget type={type} />);

    expect(getAllByText(icon)).toHaveLength(1);
  });
});
