import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { DRAFTS_PAGE_URL } from 'constants/routing';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { ConfirmModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/components/CustomFcTemplateCard/ConfirmModal';
import { useModal } from 'components/modal';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import { DAO } from 'types/dao';

import styles from './DeleteDraftButton.module.scss';

type DeleteDraftButtonProps = {
  draftId: string;
  dao?: DAO;
  state?: string;
  proposer?: string;
};

export const DeleteDraftButton: FC<DeleteDraftButtonProps> = ({
  draftId,
  dao,
  state,
  proposer,
}) => {
  const router = useRouter();
  const { draftsService } = useDraftsContext();
  const { accountId, pkAndSignature } = useWalletContext();
  const [showModal] = useModal(ConfirmModal);

  let isCouncil = false;

  if (dao) {
    isCouncil = isCouncilUser(dao, accountId);
  }

  const disabled = state === 'closed' || !(isCouncil || proposer === accountId);

  const handleDeleteDraft = useCallback(async () => {
    if (!pkAndSignature) {
      return;
    }

    const { publicKey, signature } = pkAndSignature;

    const res = await showModal({
      title: 'Delete draft',
      message: 'Are you sure you want to delete selected draft?',
    });

    if (publicKey && signature) {
      try {
        if (res[0]) {
          await draftsService.deleteDraft({
            id: draftId,
            publicKey,
            signature,
            accountId,
          });

          await router.push({
            pathname: DRAFTS_PAGE_URL,
            query: { dao: dao?.id },
          });
        }
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    }
  }, [
    accountId,
    dao,
    draftId,
    draftsService,
    pkAndSignature,
    router,
    showModal,
  ]);

  return (
    <Button
      disabled={disabled}
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
