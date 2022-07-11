import React, { FC, useCallback, useState } from 'react';
import { EditableContent } from 'astro_2.0/components/EditableContent';
import styles from 'astro_2.0/features/DraftComments/DraftComments.module.scss';
import { useWalletSelectorContext } from 'context/WalletSelectorContext';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';

interface Props {
  onSubmit: (va: string) => void;
}

export const NewComment: FC<Props> = ({ onSubmit }) => {
  const [html, setHTML] = useState('');
  const { accountId } = useWalletSelectorContext();
  const { toggleWriteComment, setToggleWriteComment } = useDraftsContext();

  const handleSend = useCallback(
    async msg => {
      await onSubmit(msg);

      setHTML('');

      setToggleWriteComment();
    },
    [onSubmit, setToggleWriteComment]
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
          handleCancel={() => setToggleWriteComment()}
        />
      ) : (
        <button
          className={styles.writeCommentButton}
          type="button"
          onClick={() => setToggleWriteComment()}
        >
          Write a comment...
        </button>
      )}
    </div>
  );
};
