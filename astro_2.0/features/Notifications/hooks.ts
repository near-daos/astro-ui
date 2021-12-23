import { useCallback } from 'react';
import { NotificationsService } from 'services/NotificationsService';
import { SputnikNearService } from 'services/sputnik';
import { useAuthContext } from 'context/AuthContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

export function useNotificationsSettings(): {
  updateSettings: (
    daoId: string | null,
    types: string[],
    isAllMuted?: boolean,
    delay?: string
  ) => void;
} {
  const { accountId } = useAuthContext();
  const updateSettings = useCallback(
    async (
      daoId: string | null,
      types: string[],
      isAllMuted?: boolean,
      delay?: string
    ) => {
      try {
        const publicKey = await SputnikNearService.getPublicKey();
        const signature = await SputnikNearService.getSignature();

        if (publicKey && signature) {
          await NotificationsService.updateNotificationSettings({
            accountId,
            publicKey,
            signature,
            daoId,
            types,
            mutedUntilTimestamp: delay ?? '0',
            isAllMuted: isAllMuted ?? false,
          });
        }
      } catch (err) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          description: err.message,
          lifetime: 20000,
        });
      }
    },
    [accountId]
  );

  return {
    updateSettings,
  };
}
