/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { DAO } from 'types/dao';

import { ViewToggle } from 'astro_2.0/features/Bounties/components/ViewToggle';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

describe('ViewToggle', () => {
  const daoId = '123';

  function renderComponent() {
    const dao = {
      id: daoId,
    } as unknown as DAO;

    return render(<ViewToggle dao={dao} />);
  }

  it('Should render component', () => {
    const router = {
      push: jest.fn(),
      asPath: '',
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it.each`
    direction | index | url
    ${'feed'} | ${0}  | ${`/dao/${daoId}/tasks/bounties/feed?bountyPhase=inProgress`}
    ${'list'} | ${1}  | ${`/dao/${daoId}/tasks/bounties/list`}
  `('Should navigate to $direction sub-page', ({ index, url }) => {
    const router = {
      push: jest.fn(),
      asPath: '',
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { getAllByRole } = renderComponent();

    fireEvent.click(getAllByRole('button')[index]);

    expect(router.push).toBeCalledWith(url);
  });
});
