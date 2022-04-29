import { ProposalVariant } from 'types/proposal';

import { getNewProposalObject } from 'astro_2.0/features/CreateProposal/helpers/newProposalObject';

import { dao, tokens } from './mock';

jest.mock(
  'astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers',
  () => {
    return {
      ...jest.requireActual(
        'astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers'
      ),
      getAddBountyProposal: () => 'getAddBountyProposal',
      getUpgradeCodeProposal: () => 'getUpgradeCodeProposal',
      getUpgradeSelfProposal: () => 'getUpgradeSelfProposal',
      getRemoveUpgradeCodeProposal: () => 'getRemoveUpgradeCodeProposal',
    };
  }
);

jest.mock('astro_2.0/features/CreateProposal/helpers/bountiesHelpers', () => {
  return {
    ...jest.requireActual(
      'astro_2.0/features/CreateProposal/helpers/bountiesHelpers'
    ),
    getAddBountyProposal: () => 'getAddBountyProposal',
  };
});

describe('newProposalObject', () => {
  describe('getChangeConfigProposal', () => {
    it.each`
      type                                        | expectedResult
      ${ProposalVariant.ProposeGetUpgradeCode}    | ${'getUpgradeCodeProposal'}
      ${ProposalVariant.ProposeRemoveUpgradeCode} | ${'getRemoveUpgradeCodeProposal'}
      ${ProposalVariant.ProposeUpgradeSelf}       | ${'getUpgradeSelfProposal'}
      ${ProposalVariant.ProposeCreateBounty}      | ${'getAddBountyProposal'}
    `(
      'Should return proposal for $type proposal',
      async ({ type, expectedResult }) => {
        const data = {
          details: 'details',
          externalUrl: 'externalUrl',
          versionHash: 'versionHash',
        };

        const result = await getNewProposalObject(
          dao,
          type,
          data,
          tokens,
          'MyAccount'
        );

        expect(result).toEqual(expectedResult);
      }
    );
  });
});
