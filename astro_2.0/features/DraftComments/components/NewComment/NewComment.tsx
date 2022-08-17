import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { EditableContent } from 'astro_2.0/components/EditableContent';
import { useWalletContext } from 'context/WalletContext';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';

import styles from 'astro_2.0/features/DraftComments/DraftComments.module.scss';

interface Props {
  onSubmit: (va: string) => void;
}

export const NewComment: FC<Props> = ({ onSubmit }) => {
  const [html, setHTML] = useState('');
  const { accountId } = useWalletContext();
  const { toggleWriteComment, setToggleWriteComment } = useDraftsContext();
  const { t } = useTranslation();

  const handleSend = useCallback(
    async msg => {
      setHTML('');

      await onSubmit(msg);
    },
    [onSubmit]
  );

  if (!accountId) {
    return null;
  }

  return (
    <div className={styles.newComment}>
      {toggleWriteComment ? (
        <EditableContent
          id="head"
          html={html}
          setHTML={setHTML}
          handleSend={handleSend}
          placeholder={t('drafts.comments.placeholder')}
          handleCancel={setToggleWriteComment}
        />
      ) : (
        <button
          className={styles.writeCommentButton}
          type="button"
          onClick={setToggleWriteComment as () => void}
        >
          {t('drafts.comments.writeCommentButton')}
        </button>
      )}
    </div>
  );
};
