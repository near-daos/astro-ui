/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { useCreateProposalFromExternal } from 'astro_2.0/features/CreateExternalProposal/hooks';

import { CreateExternalProposal } from 'astro_2.0/features/CreateExternalProposal';

jest.mock('astro_2.0/features/CreateExternalProposal/hooks', () => {
  return {
    useCreateProposalFromExternal: jest.fn(),
  };
});

describe('CreateExternalProposal', () => {
  it('Should render nothing if no error', () => {
    // @ts-ignore
    useCreateProposalFromExternal.mockImplementation(() => ({}));

    const { container } = render(
      <CreateExternalProposal onCreateProposal={() => 0} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render dao warning', () => {
    const error = 'My Error';

    // @ts-ignore
    useCreateProposalFromExternal.mockImplementation(() => ({
      error,
    }));

    const { getByText } = render(
      <CreateExternalProposal onCreateProposal={() => 0} />
    );

    expect(getByText(error)).toBeInTheDocument();
  });
});
