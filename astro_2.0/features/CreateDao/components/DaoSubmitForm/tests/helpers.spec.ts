import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';
import { getRolesVotingPolicy } from 'astro_2.0/features/CreateDao/components/DaoSubmitForm/helpers';

describe('DaoSubmitForm helpers', () => {
  const accountId = 'accountId';

  const defaultVotePolicy = {
    weight_kind: 'RoleWeight',
    quorum: '0',
    threshold: [1, 2],
  };

  function getData(structure: string, otherFields?: Record<string, unknown>) {
    return ({
      structure,
      ...otherFields,
    } as unknown) as DAOFormValues;
  }

  it('Should return proper voting policy for "flat" DAO structure', () => {
    expect(getRolesVotingPolicy(getData('flat'), accountId)).toEqual({
      roles: [
        {
          name: 'Everyone',
          kind: { Group: [accountId] },
          permissions: [
            '*:Finalize',
            '*:AddProposal',
            '*:VoteApprove',
            '*:VoteReject',
            '*:VoteRemove',
          ],
          vote_policy: {},
        },
        {
          name: 'all',
          kind: 'Everyone',
          permissions: ['*:AddProposal'],
          vote_policy: {},
        },
      ],
      defaultVotePolicy,
    });
  });

  describe('"group" structure DAO', () => {
    const generalGroupsRole = {
      name: 'Council',
      kind: { Group: [accountId] },
      permissions: [
        '*:Finalize',
        '*:AddProposal',
        '*:VoteApprove',
        '*:VoteReject',
        '*:VoteRemove',
      ],
      vote_policy: {},
    };

    it('Plain "groups" DAO structure', () => {
      expect(getRolesVotingPolicy(getData('groups'), accountId)).toEqual({
        roles: [generalGroupsRole],
        defaultVotePolicy,
      });
    });

    it('"group" with no restrictions for proposals', () => {
      expect(
        getRolesVotingPolicy(
          getData('groups', {
            proposals: 'open',
          }),
          accountId
        )
      ).toEqual({
        roles: [
          generalGroupsRole,
          {
            name: 'all',
            kind: 'Everyone',
            permissions: ['*:AddProposal'],
            vote_policy: {},
          },
        ],
        defaultVotePolicy,
      });
    });

    it('"group" with voting "weighted"', () => {
      expect(
        getRolesVotingPolicy(
          getData('groups', {
            voting: 'weighted',
          }),
          accountId
        )
      ).toEqual({
        roles: [
          generalGroupsRole,
          {
            name: 'Committee',
            kind: { Group: [accountId] },
            permissions: [
              '*:Finalize',
              '*:AddProposal',
              '*:VoteApprove',
              '*:VoteReject',
              '*:VoteRemove',
            ],
            vote_policy: {
              '*.*': {
                weight_kind: 'TokenWeight',
                quorum: '0',
                threshold: '5',
              },
            },
          },
        ],
        defaultVotePolicy,
      });
    });
  });
});
