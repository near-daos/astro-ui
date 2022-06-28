import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { ReplyButton } from 'astro_2.0/components/ReplyButton';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DraftInfoItem } from './DraftInfoItem';

import styles from './DraftInfo.module.scss';

interface DraftInfoProps {
  className?: string;
  replies: number;
  isSaved: boolean;
  saves: number;
}

export const DraftInfo: FC<DraftInfoProps> = ({
  className,
  replies,
  isSaved,
  saves,
}) => {
  const [isSavedDraft, setSavedDraft] = useState(isSaved);
  const [savesCount, setSavesCount] = useState(saves);
  const { draftsService } = useDraftsContext();
  const router = useRouter();
  const { draft } = router.query;
  const draftId = draft as string;
  const { accountId, pkAndSignature } = useWalletContext();
  const { setToggleWriteComment } = useDraftsContext();

  const handlerSaveDraft = useCallback(async () => {
    if (!pkAndSignature) {
      return;
    }

    const { publicKey, signature } = pkAndSignature;

    if (!publicKey || !signature) {
      return;
    }

    try {
      const { data } = await draftsService.updateDraftSave({
        id: draftId,
        publicKey,
        signature,
        accountId,
      });

      setSavedDraft(data);
      setSavesCount(data ? savesCount + 1 : savesCount);
    } catch (e) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: e?.message,
      });
    }
  }, [accountId, draftId, draftsService, pkAndSignature, savesCount]);

  return (
    <div className={cn(styles.draftInfo, className)}>
      <DraftInfoItem
        iconName="draftComments"
        count={replies}
        className={styles.draftInfoItem}
      />
      <DraftInfoItem
        onClick={!isSavedDraft ? () => handlerSaveDraft() : undefined}
        iconName={isSavedDraft ? 'draftBookmarkFulfill' : 'draftBookmark'}
        count={savesCount}
        className={styles.draftInfoItem}
      />
      <ReplyButton onClick={() => setToggleWriteComment(true)} />
    </div>
  );
};
