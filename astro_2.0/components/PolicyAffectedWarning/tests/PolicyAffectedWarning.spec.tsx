/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { Proposal, ProposalType } from 'types/proposal';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn().mockReturnValue({ accountId: 'jason' }),
  };
});

jest.mock('next-i18next', () => ({
  Trans: ({
    i18nKey,
    values,
  }: {
    i18nKey: string;
    values: Record<string, unknown>;
  }) => <div>{`${i18nKey} ${Object.values(values).join(',')}`}</div>,
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('policy affected warning', () => {
  function getProposal(props?: Record<string, unknown>) {
    return {
      daoId: '123',
      id: '123',
      ...props,
    } as Proposal;
  }

  it('Should render nothing if data is empty', () => {
    const { container } = render(<PolicyAffectedWarning data={[]} />);

    expect(container).toMatchSnapshot();
  });

  it('Should render component', () => {
    const { container, getAllByText } = render(
      <PolicyAffectedWarning data={[getProposal()]} />
    );

    expect(container).toMatchSnapshot();
    expect(getAllByText('daoConfig', { exact: false })).toHaveLength(2);
  });

  it('Should render "votingPolicy" title', () => {
    const { getAllByText } = render(
      <PolicyAffectedWarning
        data={[
          getProposal({
            kind: {
              type: ProposalType.ChangePolicy,
            },
          }),
        ]}
      />
    );

    expect(getAllByText('votingPolicy', { exact: false })).toHaveLength(2);
  });

  it('Should navigate to proposal page', () => {
    const router = {
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { getByRole } = render(
      <PolicyAffectedWarning data={[getProposal()]} />
    );

    const button = getByRole('button');

    fireEvent.click(button);

    expect(router.push).toBeCalledWith({
      pathname: SINGLE_PROPOSAL_PAGE_URL,
      query: { dao: '123', proposal: '123' },
    });
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
