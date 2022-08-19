/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { DaoFeedItem } from 'types/dao';

import { DaoDetailsGrid } from 'astro_2.0/components/DaoDetails/DaoDetailsGrid';

import { daoMock } from './mock';

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(),
    useMeasure: jest.fn(() => [() => 0, { width: 10 }]),
  };
});

jest.mock('react-text-truncate', () => {
  return () => <div />;
});

jest.mock(
  'astro_2.0/components/DaoDetails/DaoDetailsGrid/components/DaoDetailsSkeleton',
  () => ({
    DaoDetailsSkeleton: () => <div>Skeleton</div>,
  })
);

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

describe('dao details grid', () => {
  it('Should render component', () => {
    const { container } = render(
      <DaoDetailsGrid dao={daoMock} activeProposals={12} totalProposals={12} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render skeleton if data is loading', () => {
    const { container } = render(
      <DaoDetailsGrid
        dao={daoMock}
        activeProposals={12}
        totalProposals={12}
        loading
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should use dao id when displayName not presented', () => {
    const id = 'myTestId';

    const dao = {
      ...daoMock,
      displayName: undefined,
      description: undefined,
      id,
    } as unknown as DaoFeedItem;

    const component = render(
      <DaoDetailsGrid dao={dao} activeProposals={12} totalProposals={12} />
    );

    expect(component.getAllByText(id)).toHaveLength(2);
  });

  it.each`
    button        | url
    ${'settings'} | ${`/dao/${daoMock.id}/governance/settings`}
    ${'nfts'}     | ${`/dao/${daoMock.id}/treasury/nfts`}
    ${'bounties'} | ${`/dao/${daoMock.id}/tasks/bounties/list`}
    ${'polls'}    | ${`/dao/${daoMock.id}/tasks/polls`}
  `(
    'Should navigate to proper url when user click "$button" action button',
    ({ button }) => {
      const router = {
        push: jest.fn(),
      };

      // @ts-ignore
      useRouter.mockImplementation(() => router);

      const component = render(
        <DaoDetailsGrid
          dao={daoMock}
          activeProposals={12}
          totalProposals={12}
        />
      );

      const actionButton = component.getByText(button);

      fireEvent.click(actionButton);

      expect(router.push).toBeCalled();
    }
  );

  it('Should use singular titles for proposals when needed', () => {
    const { getAllByText } = render(
      <DaoDetailsGrid dao={daoMock} activeProposals={1} totalProposals={1} />
    );

    expect(
      getAllByText('components.daoDetails.proposalTrackerCard.active', {
        exact: false,
      })
    ).toHaveLength(1);

    expect(
      getAllByText(/components.daoDetails.proposalTrackerCard.proposal$/, {
        exact: false,
      })
    ).toHaveLength(1);
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
