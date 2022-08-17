/* eslint-disable @typescript-eslint/ban-ts-comment */

import { renderHook } from '@testing-library/react-hooks/dom';

import { UserPermissions } from 'types/context';

import { SputnikHttpService } from 'services/sputnik';

import { useWalletContext } from 'context/WalletContext';
import { useJoinDao } from 'astro_2.0/features/DaoDashboardHeader/hooks/useJoinDao';

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({
      accountId: 'account',
    })),
  };
});

describe('useJoinDao', () => {
  it('Should not show neither button, nor warning', () => {
    // @ts-ignore
    useWalletContext.mockImplementationOnce(() => ({}));

    const { result } = renderHook(() =>
      useJoinDao('', {} as UserPermissions, [])
    );

    expect(result.current).toEqual({ showButton: false, showWarning: false });
  });

  it('Should show warning', async () => {
    SputnikHttpService.getJoiningDaoProposal = () => Promise.resolve(true);

    const { result } = await renderHook(() =>
      useJoinDao(
        '',
        {
          isCanCreateProposals: true,
        } as UserPermissions,
        []
      )
    );

    expect(result.current).toEqual({ showButton: false, showWarning: true });
  });

  it('Should show button', async () => {
    SputnikHttpService.getJoiningDaoProposal = () => Promise.resolve(false);

    const { result } = await renderHook(() =>
      useJoinDao(
        '',
        {
          isCanCreateProposals: true,
        } as UserPermissions,
        []
      )
    );

    expect(result.current).toEqual({ showButton: true, showWarning: false });
  });
});
