/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from 'jest/testUtils';

import { DAO } from 'types/dao';
import { BountyContext } from 'types/bounties';
import { Tokens } from 'types/token';

import { BountiesListView } from 'astro_2.0/features/Bounties/components/BountiesListView';

import { prepareBountiesPageContent } from 'astro_2.0/features/Bounties/helpers';

import { bounty } from './mock';

jest.mock('astro_2.0/features/Bounties/helpers', () => {
  return {
    prepareBountiesPageContent: jest.fn(),
  };
});

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(() => true),
  };
});

describe('BountiesListView', () => {
  const dao = {} as unknown as DAO;
  const tokens = {} as unknown as Tokens;
  const context = {} as unknown as BountyContext[];

  it('Should render nothing if no dao', () => {
    const { container } = render(
      <BountiesListView bountiesContext={context} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render "No Results"', () => {
    // @ts-ignore
    prepareBountiesPageContent.mockImplementation(() => ({
      bounties: [],
      completed: [],
      proposalPhase: [],
    }));

    const { getByText } = render(
      <BountiesListView
        dao={dao}
        tokens={tokens}
        bountiesContext={context}
        handleCreateProposal={() => 0}
      />
    );

    expect(getByText('No results found')).toBeTruthy();
  });

  it('Should render component', () => {
    // @ts-ignore
    prepareBountiesPageContent.mockImplementation(() => ({
      bounties: [bounty],
      completed: [bounty],
      proposalPhase: [bounty],
    }));

    const { container } = render(
      <BountiesListView
        dao={dao}
        tokens={tokens}
        bountiesContext={context}
        handleCreateProposal={() => 0}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
