/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { DAO } from 'types/dao';
import { Bounty } from 'types/bounties';

import { useBountyControls } from 'astro_2.0/features/Bounties/components/hooks';
import { ClaimsContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/ClaimsContent';
import { fireEvent } from '@testing-library/dom';

jest.mock('astro_2.0/features/Bounties/components/hooks', () => {
  return {
    useBountyControls: jest.fn(() => ({})),
  };
});

describe('ClaimsContent', () => {
  const dao = {} as unknown as DAO;

  function getBounty(accountId?: string, times = 10) {
    return {
      times,
      bountyClaims: [
        {
          accountId,
        },
      ],
    } as unknown as Bounty;
  }

  it('Should render component', () => {
    const accountId = 'accountId';

    const { container } = render(
      <ClaimsContent
        dao={dao}
        slots={1}
        slotsTotal={1}
        bounty={getBounty(accountId)}
        accountId="accountId"
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render "Claim" button', () => {
    const { getByText } = render(
      <ClaimsContent
        dao={dao}
        slots={1}
        slotsTotal={1}
        bounty={getBounty()}
        accountId="accountId"
      />
    );

    expect(getByText('Claim')).toBeTruthy();
  });

  it('Should call claim callback', () => {
    const handleClaim = jest.fn();

    // @ts-ignore
    useBountyControls.mockImplementation(() => ({
      handleClaim,
    }));

    const { getByText } = render(
      <ClaimsContent
        dao={dao}
        slots={1}
        slotsTotal={1}
        bounty={getBounty()}
        accountId="accountId"
      />
    );

    fireEvent.click(getByText('Claim'));

    expect(handleClaim).toBeCalled();
  });

  it('Should not render claim button if bounty is unclaimable', () => {
    const { queryByText } = render(
      <ClaimsContent
        dao={dao}
        slots={1}
        slotsTotal={1}
        bounty={getBounty('', 0)}
        accountId="accountId"
      />
    );

    expect(queryByText('Claim')).toBeFalsy();
  });
});
