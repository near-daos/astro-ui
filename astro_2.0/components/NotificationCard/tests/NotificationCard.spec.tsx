/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { ProposalType } from 'types/proposal';
import { NotificationStatus, NotifiedActionType } from 'types/notification';

import { getNotificationParamsByType } from 'astro_2.0/features/Notifications';

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
      const id = '123';
      const onUpdate = jest.fn();

      const { getAllByTestId } = getNotificationComponent({ id, onUpdate });

      fireEvent.click(getAllByTestId('mark-read')[0]);

      expect(onUpdate).toBeCalledWith(id, {
        isArchived: false,
        isMuted: false,
        isRead: true,
      });
    });

    it('Should not fail if onMarkRead callback is not provided', () => {
      const { getAllByTestId } = getNotificationComponent();

      fireEvent.click(getAllByTestId('mark-read')[0]);
    });

    it('Should call handleUpdate with proper args', () => {
      const id = '123';
      const isMuted = true;
      const isArchived = true;
      const onUpdate = jest.fn();

      const { getAllByTestId } = getNotificationComponent({
        id,
        isMuted,
        isArchived,
        onUpdate,
      });

      fireEvent.click(getAllByTestId('mark-read')[0]);

      expect(onUpdate).toBeCalledWith(id, {
        isMuted,
        isArchived,
        isRead: true,
      });
    });
  });

  describe('handleDeleteClick', () => {
    it('Should call onRemove callback', () => {
      const id = '123';
      const onRemove = jest.fn();

      const { getAllByTestId } = getNotificationComponent({
        id,
        regular: false,
        onRemove,
      });

      fireEvent.click(getAllByTestId('delete-action-button')[0]);

      expect(onRemove).toBeCalledWith(id, {
        isArchived: true,
        isMuted: false,
        isRead: false,
      });
    });

    it('Should not fail if onRemove callback is not provided', () => {
      const { getAllByTestId } = getNotificationComponent({ regular: false });

      fireEvent.click(getAllByTestId('delete-action-button')[0]);
    });

    it('Should call handleUpdate with proper args', () => {
      const id = '123';
      const isMuted = true;
      const isRead = true;
      const isArchived = false;

      const onRemove = jest.fn();

      const { getAllByTestId } = getNotificationComponent({
        id,
        isMuted,
        isRead,
        isArchived,
        regular: false,
        onRemove,
      });

      fireEvent.click(getAllByTestId('delete-action-button')[0]);

      expect(onRemove).toBeCalledWith(id, {
        isMuted,
        isRead,
        isArchived: !isArchived,
      });
    });
  });

  describe('handleNotificationClick', () => {
    it('Should mark noty as read', () => {
      const id = '123';
      const onUpdate = jest.fn();

      const { getByTestId } = getNotificationComponent({ id, onUpdate });

      fireEvent.click(getByTestId('noty-content'));

      expect(onUpdate).toBeCalled();
    });

    it('Should navigate to url if provided', () => {
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
