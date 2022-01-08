import { ProposalType } from 'types/proposal';

import { getProposalScope } from 'utils/getProposalScope';

describe('get proposal scope', () => {
  it.each`
    type                                 | expected
    ${ProposalType.ChangePolicy}         | ${'policy'}
    ${ProposalType.AddBounty}            | ${'addBounty'}
    ${ProposalType.BountyDone}           | ${'bountyDone'}
    ${ProposalType.AddMemberToRole}      | ${'addMemberToRole'}
    ${ProposalType.RemoveMemberFromRole} | ${'removeMemberFromRole'}
    ${ProposalType.FunctionCall}         | ${'call'}
    ${ProposalType.Transfer}             | ${'transfer'}
    ${ProposalType.UpgradeRemote}        | ${'upgradeRemote'}
    ${ProposalType.UpgradeSelf}          | ${'upgradeSelf'}
    ${ProposalType.Vote}                 | ${'vote'}
    ${ProposalType.ChangeConfig}         | ${'config'}
    ${ProposalType.SetStakingContract}   | ${'config'}
  `(
    'Should return propoer scope for $type proposal type',
    ({ type, expected }) => {
      expect(getProposalScope(type)).toBe(expected);
    }
  );
});
