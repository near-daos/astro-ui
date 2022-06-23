import React, { FC, useCallback, useState } from 'react';
import { EditableContent } from 'astro_2.0/components/EditableContent';
import styles from 'astro_2.0/features/DraftComments/DraftComments.module.scss';
import { useToggle } from 'react-use';
import { useWalletContext } from 'context/WalletContext';

interface Props {
  onSubmit: (va: string) => void;
}

export const NewComment: FC<Props> = ({ onSubmit }) => {
  const [toggle, setToggle] = useToggle(false);
  const [html, setHTML] = useState('');
  const { accountId } = useWalletContext();

  const handleSend = useCallback(
    async msg => {
      await onSubmit(msg);

      setHTML('');

      setToggle();
    },
    [onSubmit, setToggle]
  );

  if (!accountId) {
    return null;
  }

  return (
    <div>
      {toggle ? (
        <EditableContent
          id="head"
          html={html}
          setHTML={setHTML}
          handleSend={handleSend}
          handleCancel={() => setToggle()}
        />
      ) : (
        <button
          className={styles.writeCommentButton}
          type="button"
          onClick={() => setToggle()}
        >
          Write a comment...
        </button>
      )}
    </div>
  );
};
