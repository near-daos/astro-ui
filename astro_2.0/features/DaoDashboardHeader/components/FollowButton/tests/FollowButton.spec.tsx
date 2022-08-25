/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { useModal } from 'components/modal';
import { useDaoSubscriptions } from 'hooks/useDaoSubscriptions';

import {
  ConfirmModal,
  FollowButton,
} from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';

jest.mock('components/modal', () => {
  return {
    useModal: jest.fn(() => []),
    Modal: ({ children }: { children: unknown }) => children,
  };
});

jest.mock('hooks/useDaoSubscriptions', () => {
  return {
    useDaoSubscriptions: jest.fn(() => ({})),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('FollowButton', () => {
  describe('ConfirmModal', () => {
    it('Should render modal', () => {
      const daoName = 'DAO Name';

      const { getByText } = render(
        <ConfirmModal isOpen onClose={() => 0} daoName={daoName} />
      );

      expect(getByText(daoName)).toBeTruthy();
    });

    it('Should call close callback', () => {
      const onClose = jest.fn();

      const { getByRole } = render(
        <ConfirmModal isOpen onClose={onClose} daoName="name" />
      );

      fireEvent.click(getByRole('button'));

      expect(onClose).toBeCalledWith(true);
    });
  });

  describe('FollowButton', () => {
    const daoId = '123';

    it('Should render nothing if no subscriptions', () => {
      const { container } = render(
        <FollowButton daoId={daoId} daoName="daoName" visible />
      );

      expect(container).toMatchSnapshot();
    });

    it('Should properly handle "unsubscribe" flow', () => {
      const showModal = jest.fn(() => Promise.resolve());

      // @ts-ignore
      useModal.mockImplementation(() => [showModal]);

      // @ts-ignore
      useDaoSubscriptions.mockImplementation(() => ({
        subscriptions: {
          [daoId]: 'subscription',
        },
      }));

      const { getByRole } = render(
        <FollowButton daoId={daoId} daoName="daoName" visible />
      );

      fireEvent.click(getByRole('button'));

      expect(showModal).toBeCalled();
    });

    it('Should properly handle "subscribe" flow', () => {
      const handleFollow = jest.fn();

      // @ts-ignore
      useDaoSubscriptions.mockImplementation(() => ({
        subscriptions: {},
        handleFollow,
      }));

      const { getByRole } = render(
        <FollowButton daoId={daoId} daoName="daoName" visible />
      );

      fireEvent.click(getByRole('button'));

      expect(handleFollow).toBeCalled();
    });
  });
});
