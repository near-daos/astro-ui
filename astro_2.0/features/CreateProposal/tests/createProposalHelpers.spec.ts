import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

import {
  getInitialProposalVariant,
  isUserPermittedToCreateProposal,
} from 'astro_2.0/features/CreateProposal/createProposalHelpers';

describe('createProposalHelpers', () => {
  describe('getInitialProposalVariant', () => {
    it('Should return default proposal variant', () => {
      const result = getInitialProposalVariant(
        ProposalVariant.ProposeCreateToken,
        true
      );

      expect(result).toEqual(ProposalVariant.ProposeCreateToken);
    });

    it('Should return transfer proposal variant', () => {
      const result = getInitialProposalVariant(
        ProposalVariant.ProposeRemoveMember,
        false
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
