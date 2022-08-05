/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { ProposalVariant } from 'types/proposal';

import { useWalletContext } from 'context/WalletContext';

import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';

import { daoMock, tokens, permissions } from './mocks';

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({})),
  };
});

jest.mock('context/DaoSettingsContext', () => {
  return {
    useDaoSettings: jest
      .fn()
      .mockReturnValue({ settings: {}, update: jest.fn(), loading: false }),
  };
});

jest.mock('context/DaoTokensContext', () => {
  return {
    useDaoCustomTokens: jest.fn().mockReturnValue({ tokens: {} }),
  };
});

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(() => true),
  };
});

jest.mock('astro_2.0/features/CreateProposal/createProposalHelpers', () => {
  return {
    getInitialProposalVariant: () => ProposalVariant.ProposeTransfer,
  };
});

jest.mock('astro_2.0/features/CreateProposal/helpers/newProposalObject', () => {
  return {
    getNewProposalObject: jest.fn(() => ({})),
  };
});

jest.mock('astro_2.0/components/TransactionDetailsWidget', () => {
  const { TransactionDetailsWidget: Default } = jest.requireActual(
    'astro_2.0/components/TransactionDetailsWidget'
  );

  return {
    TransactionDetailsWidget: jest.fn(Default),
  };
});

describe('CreateProposal', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, func-names
  window.HTMLElement.prototype.scrollIntoView = function () {};

  it('Should render component', () => {
    const { getByText } = render(
      <CreateProposal
        dao={daoMock}
        daoTokens={tokens}
        onClose={() => 0}
        userPermissions={permissions}
      />
    );

    expect(getByText('propose')).toBeInTheDocument();
  });

  it('Should handle submit', async () => {
    const testElId = 'test-el';

    const onClose = jest.fn();
    const createTokenTransferProposal = jest.fn(() => Promise.resolve());

    // @ts-ignore
    useWalletContext.mockImplementation(() => ({
      accountId: 123,
      nearService: {
        createTokenTransferProposal,
      },
    }));

    // @ts-ignore
    TransactionDetailsWidget.mockImplementation(({ onSubmit }) => (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div data-testid={testElId} onClick={onSubmit} />
    ));

    const { getByTestId } = render(
      <CreateProposal
        dao={daoMock}
        daoTokens={tokens}
        onClose={onClose}
        userPermissions={permissions}
      />
    );

    await fireEvent.click(getByTestId(testElId));

    expect(createTokenTransferProposal).toBeCalled();
  });
});
