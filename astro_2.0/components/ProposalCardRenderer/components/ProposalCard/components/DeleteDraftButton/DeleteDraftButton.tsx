import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { DRAFTS_PAGE_URL } from 'constants/routing';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import styles from './DeleteDraftButton.module.scss';

type DeleteDraftButtonProps = {
  draftId: string;
  daoId: string;
};

export const DeleteDraftButton: FC<DeleteDraftButtonProps> = ({
  draftId,
  daoId,
}) => {
  const router = useRouter();
  const { draftsService } = useDraftsContext();
  const { accountId, nearService } = useWalletContext();

  const handleDeleteDraft = useCallback(async () => {
    const publicKey = await nearService?.getPublicKey();
    const signature = await nearService?.getSignature();

    if (publicKey && signature && accountId) {
      try {
        await draftsService.deleteDraft({
          id: draftId,
          publicKey,
          signature,
          accountId,
        });

        router.push({ pathname: DRAFTS_PAGE_URL, query: { dao: daoId } });
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    }
  }, [accountId, daoId, draftId, draftsService, nearService, router]);

  return (
    <Button
      capitalize
      variant="transparent"
      className={styles.deleteButton}
      onClick={handleDeleteDraft}
    >
      <Icon name="buttonDelete" className={styles.deleteButtonIcon} />
      Delete
    </Button>
  );
};
