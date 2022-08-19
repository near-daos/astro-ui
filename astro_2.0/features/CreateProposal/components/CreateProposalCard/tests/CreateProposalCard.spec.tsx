import { render } from 'jest/testUtils';

import { ProposalType, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { IconButtonProps } from 'components/button/IconButton';

import { CreateProposalCard } from 'astro_2.0/features/CreateProposal/components/CreateProposalCard';

const formContextMock = {
  watch: () => 0,
  formState: {
    errors: {},
    touchedFields: {},
  },
  register: () => 0,
};

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: () => true,
  };
});

jest.mock('context/DaoTokensContext', () => {
  return {
    useDaoCustomTokens: jest.fn().mockReturnValue({ tokens: {} }),
  };
});

jest.mock('context/DaoSettingsContext', () => {
  return {
    useDaoSettings: jest
      .fn()
      .mockReturnValue({ settings: {}, update: jest.fn(), loading: false }),
  };
});

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

jest.mock('components/button/IconButton', () => {
  const { IconButton } = jest.requireActual('components/button/IconButton');

  return {
    IconButton: (props: IconButtonProps) =>
      // eslint-disable-next-line react/destructuring-assignment
      props.icon === 'close' ? (
        <div>CloseButton</div>
      ) : (
        <IconButton {...props} />
      ),
  };
});

jest.mock('react-quill', () => () => <div>Editor</div>);

const userPermissions = {
  isCanCreateProposals: true,
  isCanCreatePolicyProposals: true,
  allowedProposalsToCreate: {
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
  },
  allowedProposalsToVote: {
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
  },
};

describe('CreateGroupContent', () => {
  const dao = {} as unknown as DAO;

  it.each`
    type                                                | content
    ${'Unknown'}                                        | ${'proposalCard.proposalOwner'}
    ${ProposalVariant.ProposeDoneBounty}                | ${'createProposal.header.completeBounty'}
    ${ProposalVariant.ProposeTokenDistribution}         | ${'createProposal.header.distributionOfTokens'}
    ${ProposalVariant.ProposeStakingContractDeployment} | ${'createProposal.header.deployStakingContract'}
  `(
    'Should render component for $type proposal variant',
    ({ type, content }) => {
      const { getByText } = render(
        <CreateProposalCard
          dao={{ ...dao, id: 'test-dao' }}
          type={type}
          showClose={false}
          proposer="proposer"
          canCreateTokenProposal
          content={<div>content</div>}
          onTypeSelect={() => 0}
          userPermissions={userPermissions}
        />
      );

      expect(getByText(content)).toBeTruthy();
    }
  );

  it('Should render close button', () => {
    const { getByText } = render(
      <CreateProposalCard
        dao={{ ...dao, id: 'test-dao' }}
        showClose
        type={ProposalVariant.ProposeCreateToken}
        proposer="proposer"
        canCreateTokenProposal
        content={<div>content</div>}
        onTypeSelect={() => 0}
        userPermissions={userPermissions}
      />
    );

    expect(getByText('CloseButton')).toBeTruthy();
  });
});
