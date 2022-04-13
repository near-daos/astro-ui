import { DAO } from 'types/dao';
import { ProposalType, ProposalVariant } from 'types/proposal';

import {
  getInitialProposalVariant,
  isUserPermittedToCreateProposal,
} from 'astro_2.0/features/CreateProposal/createProposalHelpers';

const allowedProposalsToCreate = {
  [ProposalType.ChangePolicy]: true,
  [ProposalType.ChangeConfig]: true,
  [ProposalType.AddBounty]: true,
  [ProposalType.Transfer]: true,
  [ProposalType.Vote]: true,
  [ProposalType.RemoveMemberFromRole]: true,
  [ProposalType.AddMemberToRole]: true,
  [ProposalType.AddMemberToRole]: true,
  [ProposalType.FunctionCall]: true,
  [ProposalType.UpgradeRemote]: true,
  [ProposalType.UpgradeSelf]: true,
  [ProposalType.SetStakingContract]: true,
  [ProposalType.BountyDone]: true,
};

describe('createProposalHelpers', () => {
  describe('getInitialProposalVariant', () => {
    it('Should return default proposal variant', () => {
      const result = getInitialProposalVariant(
        ProposalVariant.ProposeCreateToken,
        true,
        allowedProposalsToCreate
      );

      expect(result).toEqual(ProposalVariant.ProposeCreateToken);
    });

    it('Should return transfer proposal variant', () => {
      const result = getInitialProposalVariant(
        ProposalVariant.ProposeRemoveMember,
        false,
        allowedProposalsToCreate
      );

      expect(result).toEqual(ProposalVariant.ProposeTransfer);
    });
  });

  describe('isUserPermittedToCreateProposal', () => {
    it('Should return false if no account or dao', () => {
      expect(isUserPermittedToCreateProposal(undefined, null)).toBeFalsy();
    });

    it('Should return false if no dao roles', () => {
      const dao = ({
        policy: {},
      } as unknown) as DAO;

      expect(isUserPermittedToCreateProposal('123', dao)).toBeFalsy();
    });

    it.each`
      permission         | result
      ${'*:*'}           | ${true}
      ${'*:AddProposal'} | ${true}
      ${'SomeOther'}     | ${false}
    `(
      'Should properly handle permissions for role kind "Everyone" and with permission $permissions',
      ({ permission, result }) => {
        const dao = ({
          policy: {
            roles: [
              {
                kind: 'Everyone',
                permissions: [permission],
              },
            ],
          },
        } as unknown) as DAO;

        expect(isUserPermittedToCreateProposal('123', dao)).toEqual(result);
      }
    );

    it.each`
      permission         | result
      ${'*:*'}           | ${true}
      ${'*:AddProposal'} | ${true}
      ${'SomeOther'}     | ${false}
    `(
      'Should return "true" for permissions for specific user',
      ({ permission, result }) => {
        const accountId = '123';

        const dao = ({
          policy: {
            roles: [
              {
                accountIds: [accountId],
                permissions: [permission],
              },
            ],
          },
        } as unknown) as DAO;

        expect(isUserPermittedToCreateProposal(accountId, dao)).toEqual(result);
      }
    );
  });
});
