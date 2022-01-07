import { Proposal, ProposalType } from 'types/proposal';

import {
  isTaskProposal,
  isGroupProposal,
  isTreasuryProposal,
  isGovernanceProposal,
} from 'utils/proposalFilters';

describe('proposal filters', () => {
  describe('isTaskProposal', () => {
    it.each`
      type                                 | expected
      ${ProposalType.AddBounty}            | ${true}
      ${ProposalType.BountyDone}           | ${true}
      ${ProposalType.Vote}                 | ${true}
      ${ProposalType.FunctionCall}         | ${true}
      ${ProposalType.AddMemberToRole}      | ${false}
      ${ProposalType.Transfer}             | ${false}
      ${ProposalType.RemoveMemberFromRole} | ${false}
      ${ProposalType.ChangePolicy}         | ${false}
      ${ProposalType.UpgradeRemote}        | ${false}
      ${ProposalType.UpgradeSelf}          | ${false}
      ${ProposalType.ChangeConfig}         | ${false}
      ${ProposalType.SetStakingContract}   | ${false}
    `('Should properly handle $type proposal type', ({ type, expected }) => {
      const proposal = {
        kind: {
          type,
        },
      } as Proposal;

      expect(isTaskProposal(proposal)).toBe(expected);
    });
  });

  describe('isGovernanceProposal', () => {
    it.each`
      type                                 | expected
      ${ProposalType.AddBounty}            | ${false}
      ${ProposalType.BountyDone}           | ${false}
      ${ProposalType.Vote}                 | ${false}
      ${ProposalType.FunctionCall}         | ${false}
      ${ProposalType.AddMemberToRole}      | ${false}
      ${ProposalType.Transfer}             | ${false}
      ${ProposalType.RemoveMemberFromRole} | ${false}
      ${ProposalType.ChangePolicy}         | ${true}
      ${ProposalType.UpgradeRemote}        | ${true}
      ${ProposalType.UpgradeSelf}          | ${true}
      ${ProposalType.ChangeConfig}         | ${true}
      ${ProposalType.SetStakingContract}   | ${false}
    `('Should properly handle $type proposal type', ({ type, expected }) => {
      const proposal = {
        kind: {
          type,
        },
      } as Proposal;

      expect(isGovernanceProposal(proposal)).toBe(expected);
    });
  });

  describe('isGroupProposal', () => {
    it.each`
      type                                 | expected
      ${ProposalType.AddBounty}            | ${false}
      ${ProposalType.BountyDone}           | ${false}
      ${ProposalType.Vote}                 | ${false}
      ${ProposalType.FunctionCall}         | ${false}
      ${ProposalType.AddMemberToRole}      | ${true}
      ${ProposalType.Transfer}             | ${false}
      ${ProposalType.RemoveMemberFromRole} | ${true}
      ${ProposalType.ChangePolicy}         | ${false}
      ${ProposalType.UpgradeRemote}        | ${false}
      ${ProposalType.UpgradeSelf}          | ${false}
      ${ProposalType.ChangeConfig}         | ${false}
      ${ProposalType.SetStakingContract}   | ${false}
    `('Should properly handle $type proposal type', ({ type, expected }) => {
      const proposal = {
        kind: {
          type,
        },
      } as Proposal;

      expect(isGroupProposal(proposal)).toBe(expected);
    });
  });

  describe('isTreasuryProposal', () => {
    it.each`
      type                                 | expected
      ${ProposalType.AddBounty}            | ${false}
      ${ProposalType.BountyDone}           | ${false}
      ${ProposalType.Vote}                 | ${false}
      ${ProposalType.FunctionCall}         | ${false}
      ${ProposalType.AddMemberToRole}      | ${false}
      ${ProposalType.Transfer}             | ${true}
      ${ProposalType.RemoveMemberFromRole} | ${false}
      ${ProposalType.ChangePolicy}         | ${false}
      ${ProposalType.UpgradeRemote}        | ${false}
      ${ProposalType.UpgradeSelf}          | ${false}
      ${ProposalType.ChangeConfig}         | ${false}
      ${ProposalType.SetStakingContract}   | ${true}
    `('Should properly handle $type proposal type', ({ type, expected }) => {
      const proposal = {
        kind: {
          type,
        },
      } as Proposal;

      expect(isTreasuryProposal(proposal)).toBe(expected);
    });
  });
});
