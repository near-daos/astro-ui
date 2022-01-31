/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { ProposalType } from 'types/proposal';
import { NotificationStatus, NotifiedActionType } from 'types/notification';

import {
  useNotifications,
  getNotificationParamsByType,
} from 'astro_2.0/features/Notifications';

import {
  NotificationCard,
  NotificationCardProps,
} from 'astro_2.0/components/NotificationCard';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
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

jest.mock('astro_2.0/features/Notifications', () => {
  return {
    ...jest.requireActual('astro_2.0/features/Notifications'),
    useNotifications: jest.fn(() => ({})),
    getNotificationParamsByType: jest.fn(() => ({})),
  };
});

describe('Notification Card', () => {
  function mockHandleUpdate() {
    const handleUpdate = jest.fn();

    // @ts-ignore
    useNotifications.mockImplementation(() => ({
      handleUpdate,
    }));

    return handleUpdate;
  }

  function getNotificationComponent(props?: Partial<NotificationCardProps>) {
    return render(
      <NotificationCard
        id="1"
        accountId="2"
        isNew
        isRead={false}
        isMuted={false}
        isArchived={false}
        daoId="3"
        dao={null}
        signerId="4"
        targetId="5"
        type={NotifiedActionType.Vote}
        isMuteAvailable
        isMarkReadAvailable
        isDeleteAvailable
        status={NotificationStatus.Created}
        metadata={{
          args: '',
          methodName: 'act_proposal',
          proposal: {
            id: '6',
            proposer: 'proposer',
            description: 'some description',
            votes: {},
            kind: { type: ProposalType.Vote },
          },
        }}
        createdAt="2016-01-01"
        {...props}
      />
    );
  }

  it('Should render component', () => {
    const { container } = getNotificationComponent({
      metadata: {
        args: '',
        methodName: 'act_proposal',
        // @ts-ignore
        proposal: {
          id: '6',
          description: 'some description',
          votes: {},
          kind: { type: ProposalType.Vote },
        },
      },
    });

    expect(container).toMatchSnapshot();
  });

  describe('handleMarkReadClick', () => {
    it('Should call onMarkRead callback', () => {
      mockHandleUpdate();

      const id = '123';
      const onMarkRead = jest.fn();

      const { getAllByTestId } = getNotificationComponent({ id, onMarkRead });

      fireEvent.click(getAllByTestId('mark-read')[0]);

      expect(onMarkRead).toBeCalledWith(id);
    });

    it('Should not fail if onMarkRead callback is not provided', () => {
      mockHandleUpdate();

      const { getAllByTestId } = getNotificationComponent();

      fireEvent.click(getAllByTestId('mark-read')[0]);
    });

    it('Should call handleUpdate with proper args', () => {
      const id = '123';
      const isMuted = true;
      const isArchived = true;

      const handleUpdate = mockHandleUpdate();

      const { getAllByTestId } = getNotificationComponent({
        id,
        isMuted,
        isArchived,
      });

      fireEvent.click(getAllByTestId('mark-read')[0]);

      expect(handleUpdate).toBeCalledWith(id, {
        isMuted,
        isArchived,
        isRead: true,
      });
    });
  });

  describe('handleDeleteClick', () => {
    it('Should call onRemove callback', () => {
      mockHandleUpdate();

      const id = '123';
      const onRemove = jest.fn();

      const { getAllByTestId } = getNotificationComponent({
        id,
        regular: false,
        onRemove,
      });

      fireEvent.click(getAllByTestId('delete-action-button')[0]);

      expect(onRemove).toBeCalledWith(id);
    });

    it('Should not fail if onRemove callback is not provided', () => {
      mockHandleUpdate();

      const { getAllByTestId } = getNotificationComponent({ regular: false });

      fireEvent.click(getAllByTestId('delete-action-button')[0]);
    });

    it('Should call handleUpdate with proper args', () => {
      const id = '123';
      const isMuted = true;
      const isRead = true;
      const isArchived = false;

      const handleUpdate = mockHandleUpdate();

      const { getAllByTestId } = getNotificationComponent({
        id,
        isMuted,
        isRead,
        isArchived,
        regular: false,
      });

      fireEvent.click(getAllByTestId('delete-action-button')[0]);

      expect(handleUpdate).toBeCalledWith(id, {
        isMuted,
        isRead,
        isArchived: !isArchived,
      });
    });
  });

  describe('handleNotificationClick', () => {
    it('Should mark noty as read', () => {
      mockHandleUpdate();

      const id = '123';
      const onMarkRead = jest.fn();

      const { getByTestId } = getNotificationComponent({ id, onMarkRead });

      fireEvent.click(getByTestId('noty-content'));

      expect(onMarkRead).toBeCalled();
    });

    it('Should navigate to url if provided', () => {
      mockHandleUpdate();

      const url = 'HelloWorld';

      // @ts-ignore
      getNotificationParamsByType.mockImplementation(() => ({ url }));

      const router = {
        push: jest.fn(),
      };

      // @ts-ignore
      useRouter.mockImplementation(() => router);

      const { getByTestId } = getNotificationComponent();

      fireEvent.click(getByTestId('noty-content'));

      expect(router.push).toBeCalledWith(url);
    });
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
