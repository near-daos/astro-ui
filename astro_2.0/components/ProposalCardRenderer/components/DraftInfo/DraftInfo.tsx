import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { ReplyButton } from 'astro_2.0/components/ReplyButton';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';
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
  const daoId = router.query.dao as string;
  const { draft } = router.query;
  const draftId = draft as string;
  const { accountId, pkAndSignature } = useWalletContext();
  const { setToggleWriteComment } = useDraftsContext();
  const { t } = useTranslation();

  const handlerSaveDraft = useCallback(async () => {
    if (!pkAndSignature) {
      return;
    }

    const { publicKey, signature } = pkAndSignature;

    if (!publicKey || !signature) {
      return;
    }

    try {
      let response;

      if (isSavedDraft) {
        response = await draftsService.deleteDraftSave({
          id: draftId,
          daoId,
          publicKey,
          signature,
          accountId,
        });

        setSavesCount(response.data ? savesCount - 1 : savesCount);
        setSavedDraft(false);
      } else {
        response = await draftsService.updateDraftSave({
          id: draftId,
          daoId,
          publicKey,
          signature,
          accountId,
        });

        setSavesCount(response.data ? savesCount + 1 : savesCount);
        setSavedDraft(true);
      }
    } catch (e) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: e?.message,
      });
    }
  }, [
    accountId,
    daoId,
    draftId,
    draftsService,
    isSavedDraft,
    pkAndSignature,
    savesCount,
  ]);

  const disabled = !dao?.daoMembersList.includes(accountId);

  return (
    <div className={cn(styles.draftInfo, className)}>
      <div className={styles.draftInfoWrapper}>
        <DraftInfoItem
          disabled={disabled}
          iconName="draftChat"
          count={amountComments}
          className={styles.draftInfoItem}
        />

        <DraftInfoItem
          tooltipText={t('drafts.editDraftPage.saveDraftTooltip')}
          onClick={() => handlerSaveDraft()}
          iconName={isSavedDraft ? 'draftBookmarkFulfill' : 'draftBookmark'}
          count={savesCount}
          className={styles.draftInfoItem}
        />
      </div>

      <ReplyButton
        title={t('drafts.editDraftPage.comment')}
        disabled={disabled}
        onClick={() => setToggleWriteComment(true)}
      />
    </div>
  );
};
