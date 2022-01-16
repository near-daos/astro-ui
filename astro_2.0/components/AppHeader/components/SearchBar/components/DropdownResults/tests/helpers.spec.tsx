import { Proposal, ProposalType } from 'types/proposal';

import { getProposalSearchSummary } from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults/helpers';

describe('search results dropdown helpers', () => {
  it.each`
    type
    ${ProposalType.AddMemberToRole}
    ${ProposalType.RemoveMemberFromRole}
    ${ProposalType.ChangePolicy}
    ${ProposalType.FunctionCall}
    ${ProposalType.Transfer}
    ${ProposalType.Vote}
    ${ProposalType.AddBounty}
    ${ProposalType.BountyDone}
    ${ProposalType.UpgradeSelf}
    ${ProposalType.UpgradeRemote}
    ${ProposalType.SetStakingContract}
  `('Should render proper content for $type proposals', ({ type }) => {
    const proposal = {
      kind: {
        type,
      },
    } as Proposal;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const component = getProposalSearchSummary(proposal, () => {});

    expect(component).toMatchSnapshot();
  });
});
