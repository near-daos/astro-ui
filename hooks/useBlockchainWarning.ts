import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useTranslation } from 'next-i18next';
import omit from 'lodash/omit';

export function useBlockchainWarning(): void {
  const { t } = useTranslation();
  const { query, replace } = useRouter();
  const isRedirectFromCreate = query.fromCreate;

  const updateQuery = useCallback(async () => {
    await replace(
      {
        query: omit(query, 'fromCreate'),
      },
      undefined,
      { shallow: true }
    );
  }, [query, replace]);

  useEffect(() => {
    if (isRedirectFromCreate) {
      updateQuery();

      showNotification({
        type: NOTIFICATION_TYPES.INFO,
        description: t('successProposalNotification'),
        lifetime: 20000,
      });
    }
  }, [isRedirectFromCreate, t, updateQuery]);
}
