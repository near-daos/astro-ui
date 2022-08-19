import { DAO } from 'types/dao';

import {
  getDeadline,
  getAddBountyProposal,
  getCompleteBountyProposal,
  getChangeBondDeadlinesProposal,
} from 'astro_2.0/features/CreateProposal/helpers/bountiesHelpers';

import {
  CreateBountyInput,
  BondsAndDeadlinesData,
} from 'astro_2.0/features/CreateProposal/types';
import { Tokens } from 'types/token';

describe('bountiesHelpers', () => {
  describe('getCompleteBountyProposal', () => {
    it('Should create proper object', () => {
      const daoId = 'daoId';
      const details = 'details';
      const externalUrl = 'externalUrl';
      const target = 'target';
      const bond = 'bond';
      const bountyId = 1;

      expect(
        getCompleteBountyProposal(
          daoId,
          details,
          externalUrl,
          target,
          bond,
          bountyId
        )
      ).toEqual({
        bond,
        daoId,
        data: {
          bounty_id: 1,
          receiver_id: target,
        },
        description: `${details}$$$$${externalUrl}`,
        kind: 'BountyDone',
      });
    });
  });

  describe('getDeadline', () => {
    it('Should get proper number', () => {
      expect(getDeadline(10, 'day')).toEqual('864000000000000');
      expect(getDeadline(10, 'week')).toEqual('6048000000000000');
      expect(getDeadline(10, 'month')).toEqual('25920000000000000');
    });
  });

  describe('getAddBountyProposal', () => {
    const dao = {
      id: 'daoId',
      policy: {
        proposalBond: 'proposalBond',
      },
    } as unknown as DAO;

    const data = {
      slots: 1,
      amount: 1,
      details: 'proposal details',
      deadlineUnit: 'day',
      deadlineThreshold: 10,
      externalUrl: 'some url',
      token: 'NEAR',
    } as unknown as CreateBountyInput;

    const tokens = {
      NEAR: {
        tokenId: 'NEAR',
        decimals: 10,
        symbol: 'NEAR',
      },
    } as unknown as Tokens;

    it('Should throw error if no tokens data', () => {
      expect(() => getAddBountyProposal(dao, data, {})).toThrow();
    });

    it('Should provide proposal', () => {
      expect(getAddBountyProposal(dao, data, tokens)).toEqual({
        bond: 'proposalBond',
        daoId: 'daoId',
        data: {
          bounty: {
            amount: '10000000000',
            description: 'proposal details$$$$some url',
            max_deadline: '864000000000000',
            times: 1,
            token: 'NEAR',
          },
        },
        description: 'proposal details$$$$some url',
        kind: 'AddBounty',
      });
    });
  });

  describe('getChangeBondDeadlinesProposal', () => {
    it('Should provide proper object', () => {
      const dao = {
        id: 'daoId',
        policy: {
          defaultVotePolicy: {
            weightKind: 'RoleWeight',
            quorum: '0',
            ratio: [1, 2],
          },
          roles: [
            {
              isArchived: false,
              createdAt: '2021-12-02T22:13:53.346Z',
              updatedAt: '2022-03-30T20:00:33.563Z',
              id: 'legaldao.sputnikv2.testnet-Everyone',
              name: 'Everyone',
              kind: 'Group',
              balance: null,
              accountIds: ['alexeysputnik.testnet'],
              permissions: [
                '*:VoteReject',
                '*:VoteRemove',
                '*:VoteApprove',
                '*:AddProposal',
                '*:Finalize',
              ],
              votePolicy: {},
            },
          ],
        },
      } as unknown as DAO;

      const bondsAndDeadlines = {
        createProposalBond: 123,
        proposalExpireTime: 1,
        claimBountyBond: 1,
        unclaimBountyTime: 1,
      } as unknown as BondsAndDeadlinesData;

      const initialValues = {
        accountName: 'accountName',
        createProposalBond: 1,
        proposalExpireTime: 2,
        claimBountyBond: 3,
        unclaimBountyTime: 4,
      };

      expect(
        getChangeBondDeadlinesProposal(
          dao,
          bondsAndDeadlines,
          initialValues,
          'proposalBond',
          'some description'
        )
      ).toEqual({
        bond: 'proposalBond',
        daoId: 'daoId',
        data: {
          policy: {
            bounty_bond: '1000000000000000000000000',
            bounty_forgiveness_period: '3600000000000',
            default_vote_policy: {
              quorum: '0',
              threshold: [1, 2],
              weight_kind: 'RoleWeight',
            },
            proposal_bond: '123000000000000000000000000',
            proposal_period: '3600000000000',
            roles: [
              {
                kind: {
                  Group: ['alexeysputnik.testnet'],
                },
                name: 'Everyone',
                permissions: [
                  '*:VoteReject',
                  '*:VoteRemove',
                  '*:VoteApprove',
                  '*:AddProposal',
                  '*:Finalize',
                ],
                vote_policy: {},
              },
            ],
          },
        },
        description: 'some description',
        kind: 'ChangePolicy',
      });
    });
  });
});
