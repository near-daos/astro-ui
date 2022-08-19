/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DAO } from 'types/dao';
import { Bounty } from 'types/bounties';
import { ProposalVariant } from 'types/proposal';

import { render } from 'jest/testUtils';

import { useBountyControls } from 'astro_2.0/features/Bounties/components/hooks';

import { UnclaimCompleteContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/UnclaimCompleteContent';
import { fireEvent } from '@testing-library/dom';

jest.mock('astro_2.0/features/Bounties/components/hooks', () => {
  return {
    useBountyControls: jest.fn(() => ({})),
  };
});

describe('UnclaimCompleteContent', () => {
  const bountyId = 'bountyId';

  const dao = {} as unknown as DAO;
  const bounty = {
    bountyId,
  } as unknown as Bounty;

  it('Should render component', () => {
    const { container } = render(
      <UnclaimCompleteContent dao={dao} bounty={bounty} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should call unclaim callback', () => {
    const handleUnclaim = jest.fn();

    // @ts-ignore
    useBountyControls.mockImplementation(() => ({
      handleUnclaim,
    }));

    const { getByTestId } = render(
      <UnclaimCompleteContent dao={dao} bounty={bounty} />
    );

    fireEvent.click(getByTestId('ucc-unclaim'));

    expect(handleUnclaim).toBeCalled();
  });

  it('Should call complete callback', () => {
    const completeHandler = jest.fn();

    const { getByTestId } = render(
      <UnclaimCompleteContent
        dao={dao}
        bounty={bounty}
        completeHandler={completeHandler}
      />
    );

    fireEvent.click(getByTestId('ucc-complete'));

    expect(completeHandler).toBeCalledWith(
      bountyId,
      ProposalVariant.ProposeDoneBounty
    );
  });

  it('Should not fail if no complete callback', () => {
    const { getByTestId } = render(
      <UnclaimCompleteContent dao={dao} bounty={bounty} />
    );

    fireEvent.click(getByTestId('ucc-complete'));
  });
});
