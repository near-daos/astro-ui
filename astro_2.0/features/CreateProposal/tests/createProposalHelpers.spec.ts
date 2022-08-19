/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DAO } from 'types/dao';
import { ProposalType, ProposalVariant } from 'types/proposal';

import {
  getProposalTypeByVariant,
  getInitialProposalVariant,
  getAllowedProposalsToVote,
  getAllowedProposalsToCreate,
  isUserPermittedToCreateProposal,
  getDefaultProposalVariantByType,
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

function getDao(permission: string, accountId?: string): DAO {
  return {
    policy: {
      roles: [
        {
          accountIds: accountId ? [accountId] : accountId,
          kind: accountId ? '' : 'Everyone',
          permissions: [permission],
        },
      ],
    },
  } as DAO;
}

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

    it('Should return ProposeRemoveMember proposal variant', () => {
      const result = getInitialProposalVariant(
        ProposalVariant.ProposeRemoveMember,
        false,
        allowedProposalsToCreate
      );

      expect(result).toEqual(ProposalVariant.ProposeRemoveMember);
    });
  });

  describe('isUserPermittedToCreateProposal', () => {
    it('Should return false if no account or dao', () => {
      expect(isUserPermittedToCreateProposal(undefined, null)).toBeFalsy();
    });

    it('Should return false if no dao roles', () => {
      const dao = {
        policy: {},
      } as unknown as DAO;

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
        const dao = {
          policy: {
            roles: [
              {
                kind: 'Everyone',
                permissions: [permission],
              },
            ],
          },
        } as unknown as DAO;

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

        const dao = {
          policy: {
            roles: [
              {
                accountIds: [accountId],
                permissions: [permission],
              },
            ],
          },
        } as unknown as DAO;

        expect(isUserPermittedToCreateProposal(accountId, dao)).toEqual(result);
      }
    );
  });

  describe('getAllowedProposalsToCreate', () => {
    const result = Object.keys(allowedProposalsToCreate).reduce(
      (acc: Record<string, boolean>, key) => {
        acc[key] = false;

        return acc;
      },
      {}
    );

    it('Should return default result', () => {
      expect(getAllowedProposalsToCreate(null, null, false)).toEqual(result);
      expect(getAllowedProposalsToCreate('123', null, false)).toEqual(result);
      expect(getAllowedProposalsToCreate('123', getDao('abcd'), false)).toEqual(
        result
      );
    });

    it.each`
      permission
      ${'*:*'}
      ${'*:AddProposal'}
    `(
      'Should allow everything for $permission permission',
      ({ permission }) => {
        expect(
          getAllowedProposalsToCreate('123', getDao(permission, '123'), false)
        ).toEqual(allowedProposalsToCreate);
      }
    );

    it.each`
      permission                               | proposalType
      ${'config:AddProposal'}                  | ${ProposalType.ChangeConfig}
      ${'call:AddProposal'}                    | ${ProposalType.FunctionCall}
      ${'bounty_done:AddProposal'}             | ${ProposalType.BountyDone}
      ${'policy:AddProposal'}                  | ${ProposalType.ChangePolicy}
      ${'add_bounty:AddProposal'}              | ${ProposalType.AddBounty}
      ${'transfer:AddProposal'}                | ${ProposalType.Transfer}
      ${'vote:AddProposal'}                    | ${ProposalType.Vote}
      ${'remove_member_from_role:AddProposal'} | ${ProposalType.RemoveMemberFromRole}
      ${'add_member_to_role:AddProposal'}      | ${ProposalType.AddMemberToRole}
      ${'upgrade_self:AddProposal'}            | ${ProposalType.UpgradeSelf}
      ${'upgrade_remote:AddProposal'}          | ${ProposalType.UpgradeRemote}
      ${'set_vote_token:AddProposal'}          | ${ProposalType.SetStakingContract}
    `(
      'Should allow $proposalType for $permission $permission',
      ({ permission, proposalType }) => {
        expect(
          getAllowedProposalsToCreate('123', getDao(permission), false)
        ).toEqual({
          ...result,
          [proposalType]: true,
        });
      }
    );
  });

  describe('getAllowedProposalsToVote', () => {
    const result = Object.keys(allowedProposalsToCreate).reduce(
      (acc: Record<string, boolean>, key) => {
        acc[key] = false;

        return acc;
      },
      {}
    );

    it('Should return default result', () => {
      expect(getAllowedProposalsToVote(null, null)).toEqual(result);
      expect(getAllowedProposalsToVote('123', null)).toEqual(result);
      expect(getAllowedProposalsToVote('123', getDao('abcd'))).toEqual(result);
    });

    it.each`
      permission
      ${'*:*'}
      ${'*:VoteApprove'}
      ${'*:VoteReject'}
      ${'*:VoteRemove'}
    `('Should properly process $permission permission', ({ permission }) => {
      expect(
        getAllowedProposalsToVote('123', getDao(permission, '123'))
      ).toEqual({
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
      });
    });

    it.each`
      permission                               | proposalType
      ${'policy:VoteApprove'}                  | ${ProposalType.ChangePolicy}
      ${'policy:VoteReject'}                   | ${ProposalType.ChangePolicy}
      ${'policy:VoteRemove'}                   | ${ProposalType.ChangePolicy}
      ${'add_bounty:VoteApprove'}              | ${ProposalType.AddBounty}
      ${'add_bounty:VoteReject'}               | ${ProposalType.AddBounty}
      ${'add_bounty:VoteRemove'}               | ${ProposalType.AddBounty}
      ${'transfer:VoteApprove'}                | ${ProposalType.Transfer}
      ${'transfer:VoteReject'}                 | ${ProposalType.Transfer}
      ${'transfer:VoteRemove'}                 | ${ProposalType.Transfer}
      ${'vote:VoteApprove'}                    | ${ProposalType.Vote}
      ${'vote:VoteReject'}                     | ${ProposalType.Vote}
      ${'vote:VoteRemove'}                     | ${ProposalType.Vote}
      ${'remove_member_from_role:VoteApprove'} | ${ProposalType.RemoveMemberFromRole}
      ${'remove_member_from_role:VoteReject'}  | ${ProposalType.RemoveMemberFromRole}
      ${'remove_member_from_role:VoteRemove'}  | ${ProposalType.RemoveMemberFromRole}
      ${'add_member_to_role:VoteApprove'}      | ${ProposalType.AddMemberToRole}
      ${'add_member_to_role:VoteReject'}       | ${ProposalType.AddMemberToRole}
      ${'add_member_to_role:VoteRemove'}       | ${ProposalType.AddMemberToRole}
    `(
      'Should allow $proposalType for $permission $permission',
      ({ permission, proposalType }) => {
        expect(getAllowedProposalsToVote('123', getDao(permission))).toEqual({
          ...result,
          [proposalType]: true,
        });
      }
    );
  });

  describe('getDefaultProposalVariantByType', () => {
    it.each`
      proposalType                         | proposalVariant
      ${ProposalType.ChangeConfig}         | ${ProposalVariant.ProposeChangeDaoName}
      ${ProposalType.ChangePolicy}         | ${ProposalVariant.ProposeChangeVotingPolicy}
      ${ProposalType.FunctionCall}         | ${ProposalVariant.ProposeCustomFunctionCall}
      ${ProposalType.Vote}                 | ${ProposalVariant.ProposePoll}
      ${ProposalType.Transfer}             | ${ProposalVariant.ProposeTransfer}
      ${ProposalType.RemoveMemberFromRole} | ${ProposalVariant.ProposeRemoveMember}
      ${ProposalType.AddMemberToRole}      | ${ProposalVariant.ProposeAddMember}
      ${ProposalType.AddBounty}            | ${ProposalVariant.ProposeCreateBounty}
      ${'Default'}                         | ${ProposalVariant.ProposeDefault}
    `(
      'Should return proper proposal variant for proposal type',
      ({ proposalType, proposalVariant }) => {
        expect(getDefaultProposalVariantByType(proposalType)).toEqual(
          proposalVariant
        );
      }
    );
  });

  describe('getProposalTypeByVariant', () => {
    it.each`
      proposalVariant                                             | proposalType
      ${ProposalVariant.ProposeAddMember}                         | ${ProposalType.AddMemberToRole}
      ${ProposalVariant.ProposeCreateBounty}                      | ${ProposalType.AddBounty}
      ${ProposalVariant.ProposeDoneBounty}                        | ${ProposalType.BountyDone}
      ${ProposalVariant.ProposeRemoveMember}                      | ${ProposalType.RemoveMemberFromRole}
      ${ProposalVariant.ProposeTransfer}                          | ${ProposalType.Transfer}
      ${ProposalVariant.ProposeChangeDaoLegalInfo}                | ${ProposalType.ChangeConfig}
      ${ProposalVariant.ProposeChangeDaoName}                     | ${ProposalType.ChangeConfig}
      ${ProposalVariant.ProposeChangeDaoFlag}                     | ${ProposalType.ChangeConfig}
      ${ProposalVariant.ProposeChangeDaoLinks}                    | ${ProposalType.ChangeConfig}
      ${ProposalVariant.ProposeChangeDaoPurpose}                  | ${ProposalType.ChangeConfig}
      ${ProposalVariant.ProposeCustomFunctionCall}                | ${ProposalType.FunctionCall}
      ${ProposalVariant.ProposePoll}                              | ${ProposalType.Vote}
      ${ProposalVariant.ProposeChangeProposalCreationPermissions} | ${ProposalType.ChangePolicy}
      ${ProposalVariant.ProposeChangeProposalVotingPermissions}   | ${ProposalType.ChangePolicy}
      ${ProposalVariant.ProposeChangeVotingPolicy}                | ${ProposalType.ChangePolicy}
      ${ProposalVariant.ProposeChangeBonds}                       | ${ProposalType.ChangePolicy}
      ${ProposalVariant.ProposeCreateGroup}                       | ${ProposalType.ChangePolicy}
      ${ProposalVariant.ProposeTokenDistribution}                 | ${ProposalType.SetStakingContract}
      ${ProposalVariant.ProposeStakingContractDeployment}         | ${ProposalType.SetStakingContract}
      ${ProposalVariant.ProposeCreateToken}                       | ${ProposalType.SetStakingContract}
      ${ProposalVariant.ProposeRemoveUpgradeCode}                 | ${ProposalType.UpgradeSelf}
      ${ProposalVariant.ProposeGetUpgradeCode}                    | ${ProposalType.UpgradeSelf}
      ${ProposalVariant.ProposeUpgradeSelf}                       | ${ProposalType.UpgradeSelf}
      ${'Default'}                                                | ${null}
    `(
      'Should return proper proposal type for proposal variant',
      ({ proposalVariant, proposalType }) => {
        expect(getProposalTypeByVariant(proposalVariant)).toEqual(proposalType);
      }
    );
  });
});
