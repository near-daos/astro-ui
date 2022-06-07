import { ProposalVariant } from 'types/proposal';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

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
      getTransferProposal: () => 'getTransferProposal',
      getChangeConfigProposal: () => 'getChangeConfigProposal',
      getCreateTokenProposal: () => 'getCreateTokenProposal',
      getSwapsOnRefProposal: () => 'getSwapsOnRefProposal',
      getBuyNftFromParasProposal: () => 'getBuyNftFromParasProposal',
      getBuyNftFromMintbaseProposal: () => 'getBuyNftFromMintbaseProposal',
      getTransferMintbaseNFTProposal: () => 'getTransferMintbaseNFTProposal',
      getCustomFunctionCallProposal: () => 'getCustomFunctionCallProposal',
    };
  }
);

jest.mock('astro_2.0/features/CreateProposal/helpers/bountiesHelpers', () => {
  return {
    getAddBountyProposal: () => 'getAddBountyProposal',
    getCompleteBountyProposal: () => 'getCompleteBountyProposal',
    getChangeBondDeadlinesProposal: () => 'getChangeBondDeadlinesProposal',
  };
});

jest.mock('features/groups/helpers', () => {
  return {
    getAddMemberProposal: () => 'getAddMemberProposal',
    getRemoveMemberProposal: () => 'getRemoveMemberProposal',
    getChangePolicyProposal: () => 'getChangePolicyProposal',
  };
});

jest.mock('features/vote-policy/helpers', () => {
  return {
    getInitialData: () => ({}),
    getNewProposalObject: () => 'getNewVotingPolicyProposalObject',
  };
});

jest.mock(
  'astro_2.0/features/CreateProposal/components/TokenDistributionContent/helpers',
  () => {
    return {
      getTokenDistributionProposal: () => 'getTokenDistributionProposal',
    };
  }
);

jest.mock(
  'astro_2.0/features/CreateProposal/helpers/permissionsHelpers',
  () => {
    return {
      getNewPermissionsProposalObject: () => 'getNewPermissionsProposalObject',
    };
  }
);

describe('newProposalObject', () => {
  const data = {
    details: 'details',
    externalUrl: 'externalUrl',
    versionHash: 'versionHash',
    unstakingPeriod: 'unstakingPeriod',
    links: [
      {
        id: 'someId',
        url: 'someUrl',
      },
    ],
  };

  it.each`
    type                                                        | expectedResult
    ${ProposalVariant.ProposeGetUpgradeCode}                    | ${'getUpgradeCodeProposal'}
    ${ProposalVariant.ProposeRemoveUpgradeCode}                 | ${'getRemoveUpgradeCodeProposal'}
    ${ProposalVariant.ProposeUpgradeSelf}                       | ${'getUpgradeSelfProposal'}
    ${ProposalVariant.ProposeCreateBounty}                      | ${'getAddBountyProposal'}
    ${ProposalVariant.ProposeDoneBounty}                        | ${'getCompleteBountyProposal'}
    ${ProposalVariant.ProposeTransfer}                          | ${'getTransferProposal'}
    ${ProposalVariant.ProposeChangeDaoLinks}                    | ${'getChangeConfigProposal'}
    ${ProposalVariant.ProposeChangeDaoName}                     | ${'getChangeConfigProposal'}
    ${ProposalVariant.ProposeChangeDaoPurpose}                  | ${'getChangeConfigProposal'}
    ${ProposalVariant.ProposeRemoveMember}                      | ${'getRemoveMemberProposal'}
    ${ProposalVariant.ProposeAddMember}                         | ${'getAddMemberProposal'}
    ${ProposalVariant.ProposeCreateGroup}                       | ${'getChangePolicyProposal'}
    ${ProposalVariant.ProposeChangeVotingPolicy}                | ${'getNewVotingPolicyProposalObject'}
    ${ProposalVariant.ProposeChangeBonds}                       | ${'getChangeBondDeadlinesProposal'}
    ${ProposalVariant.ProposeChangeDaoFlag}                     | ${'getChangeConfigProposal'}
    ${ProposalVariant.ProposeChangeDaoLegalInfo}                | ${'getChangeConfigProposal'}
    ${ProposalVariant.ProposeCreateToken}                       | ${'getCreateTokenProposal'}
    ${ProposalVariant.ProposeTokenDistribution}                 | ${'getTokenDistributionProposal'}
    ${ProposalVariant.ProposeChangeProposalVotingPermissions}   | ${'getNewPermissionsProposalObject'}
    ${ProposalVariant.ProposeChangeProposalCreationPermissions} | ${'getNewPermissionsProposalObject'}
  `(
    'Should return proposal for $type proposal',
    async ({ type, expectedResult }) => {
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

  it('Should return proposal for ProposePoll proposal', async () => {
    const result = await getNewProposalObject(
      dao,
      ProposalVariant.ProposePoll,
      data,
      tokens,
      'MyAccount'
    );

    expect(result).toEqual({
      daoId: 'legaldao.sputnikv2.testnet',
      description: 'details$$$$externalUrl',
      kind: 'Vote',
      bond: '100000000000000000000000',
    });
  });

  it('Should return proposal for ProposeContractAcceptance proposal', async () => {
    const result = await getNewProposalObject(
      dao,
      ProposalVariant.ProposeStakingContractDeployment,
      data,
      tokens,
      'MyAccount'
    );

    expect(result).toEqual({
      stakingContractName: 'legaldao-staking',
      daoId: 'legaldao.sputnikv2.testnet',
      tokenId: undefined,
      daoBond: '100000000000000000000000',
      unstakingPeriodInHours: 'unstakingPeriod',
      description: 'Deploy staking contract via factory',
    });
  });

  it('Should return null if no proper proposal type', async () => {
    const result = await getNewProposalObject(
      dao,
      'Biba&Boba' as ProposalVariant,
      data,
      tokens,
      'MyAccount'
    );

    expect(result).toBeNull();
  });

  it.each`
    type                                        | expectedResult
    ${FunctionCallType.SwapsOnRef}              | ${'getSwapsOnRefProposal'}
    ${FunctionCallType.BuyNFTfromParas}         | ${'getBuyNftFromParasProposal'}
    ${FunctionCallType.BuyNFTfromMintbase}      | ${'getBuyNftFromMintbaseProposal'}
    ${FunctionCallType.TransferNFTfromMintbase} | ${'getTransferMintbaseNFTProposal'}
    ${'Unkown type'}                            | ${'getCustomFunctionCallProposal'}
  `(
    'Should return proper "custom function call proposal" for $type function call type',
    async ({ type, expectedResult }) => {
      const result = await getNewProposalObject(
        dao,
        ProposalVariant.ProposeCustomFunctionCall,
        {
          ...data,
          functionCallType: type,
        },
        tokens,
        'MyAccount'
      );

      expect(result).toEqual(expectedResult);
    }
  );
});
