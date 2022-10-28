/* eslint-disable @typescript-eslint/ban-ts-comment */

import { renderHook } from '@testing-library/react-hooks/dom';

import { UserPermissions } from 'types/context';

import { SputnikHttpService } from 'services/sputnik';

import { useWalletContext } from 'context/WalletContext';
import { useJoinDao } from 'astro_2.0/features/DaoDashboardHeader/hooks/useJoinDao';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn().mockReturnValue({ query: { dao: 'dao' } }),
  };
});

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({
      accountId: 'account',
    })),
  };
});

describe('useJoinDao', () => {
  it.skip('Should not show neither button, nor warning', () => {
    // @ts-ignore
    useWalletContext.mockImplementationOnce(() => ({}));

    const { result } = renderHook(() =>
      useJoinDao('', { allowedProposalsToCreate: {} } as UserPermissions, [])
    );

    expect(result.current).toEqual({ showButton: false, showWarning: false });
  });

  it.skip('Should show warning', async () => {
    SputnikHttpService.getJoiningDaoProposal = () => Promise.resolve(true);

    const { result } = await renderHook(() =>
      useJoinDao(
        '',
        {
          isCanCreateProposals: true,
          allowedProposalsToCreate: {},
        } as UserPermissions,
        []
      )
    );

    expect(result.current).toEqual({ showButton: false, showWarning: true });
  });

  it.skip('Should show button', async () => {
    SputnikHttpService.getJoiningDaoProposal = () => Promise.resolve(false);

    const { result } = await renderHook(() =>
      useJoinDao(
        '',
        {
          isCanCreateProposals: true,
          allowedProposalsToCreate: {},
        } as UserPermissions,
        []
      )
    );

    expect(result.current).toEqual({ showButton: true, showWarning: false });
  });
});
