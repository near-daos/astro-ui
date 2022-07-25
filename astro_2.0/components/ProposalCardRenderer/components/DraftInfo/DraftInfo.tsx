import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { ReplyButton } from 'astro_2.0/components/ReplyButton';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';
import { useWalletContext } from 'context/WalletContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { DAO } from 'types/dao';
import { DraftInfoItem } from './DraftInfoItem';

import styles from './DraftInfo.module.scss';

interface DraftInfoProps {
  className?: string;
  isSaved: boolean;
  saves: number;
  dao?: DAO;
}

export const DraftInfo: FC<DraftInfoProps> = ({
  className,
  isSaved,
  saves,
  dao,
}) => {
  const [isSavedDraft, setSavedDraft] = useState(isSaved);
  const [savesCount, setSavesCount] = useState(saves);
  const { draftsService, amountComments } = useDraftsContext();
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
  const disabled = !dao?.daoMembersList.includes(accountId);

  return (
    <div className={cn(styles.draftInfo, className)}>
      <div className={styles.draftInfoWrapper}>
        <DraftInfoItem
          disabled={disabled}
          iconName="draftComments"
          count={amountComments}
          className={styles.draftInfoItem}
        />
        <DraftInfoItem
          disabled={disabled}
          onClick={!isSavedDraft ? () => handlerSaveDraft() : undefined}
          iconName={isSavedDraft ? 'draftBookmarkFulfill' : 'draftBookmark'}
          count={savesCount}
          className={styles.draftInfoItem}
        />
      </div>

      <ReplyButton
        disabled={disabled}
        onClick={() => setToggleWriteComment(true)}
      />
    </div>
  );
};
