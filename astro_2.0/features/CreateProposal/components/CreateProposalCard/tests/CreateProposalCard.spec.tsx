import { render } from 'jest/testUtils';

import { ProposalVariant } from 'types/proposal';
import { IconButtonProps } from 'components/button/IconButton';

import { CreateProposalCard } from 'astro_2.0/features/CreateProposal/components/CreateProposalCard';

const formContextMock = {
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

jest.mock(
  'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/FunctionCallTypeSelector',
  () => {
    return {
      FunctionCallTypeSelector: () => <div>FunctionCallTypeSelector</div>,
    };
  }
);

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

describe('CreateGroupContent', () => {
  it.each`
    type                                         | content
    ${'Unknown'}                                 | ${'proposalCard.proposalOwner'}
    ${ProposalVariant.ProposeDoneBounty}         | ${'Complete Bounty'}
    ${ProposalVariant.ProposeTokenDistribution}  | ${'Distribution of tokens'}
    ${ProposalVariant.ProposeContractAcceptance} | ${'Acceptance of contract'}
    ${ProposalVariant.ProposeCustomFunctionCall} | ${'FunctionCallTypeSelector'}
  `(
    'Should render component for $type proposal variant',
    ({ type, content }) => {
      const { getByText } = render(
        <CreateProposalCard
          type={type}
          showClose={false}
          proposer="proposer"
          canCreateTokenProposal
          content={<div>content</div>}
          onTypeSelect={() => 0}
          userPermissions={{
            isCanCreateProposals: true,
            isCanCreatePolicyProposals: true,
          }}
        />
      );

      expect(getByText(content)).toBeTruthy();
    }
  );

  it('Should render close button', () => {
    const { getByText } = render(
      <CreateProposalCard
        showClose
        type={ProposalVariant.ProposeCreateToken}
        proposer="proposer"
        canCreateTokenProposal
        content={<div>content</div>}
        onTypeSelect={() => 0}
        userPermissions={{
          isCanCreateProposals: true,
          isCanCreatePolicyProposals: true,
        }}
      />
    );

    expect(getByText('CloseButton')).toBeTruthy();
  });
});
