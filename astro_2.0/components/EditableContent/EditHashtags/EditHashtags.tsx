/* eslint-disable react/no-array-index-key */
import React, { FC } from 'react';
import { nanoid } from 'nanoid';
import cn from 'classnames';

import { Hashtag } from 'types/draftProposal';

import { HashtagInput } from './HashtagInput';

import styles from './EditHashtags.module.scss';

const MAX_HASHTAGS = 6;

type EditHashtagsProps = {
  hashtags: Hashtag[];
  setHashtags: (hashtags: Hashtag[]) => void;
  error?: string;
};

export const EditHashtags: FC<EditHashtagsProps> = ({
  hashtags,
  setHashtags,
  error,
}) => {
  const addHashtag = () => {
    if (hashtags.length !== MAX_HASHTAGS) {
      const nextHashtags = [...hashtags];

      nextHashtags.push({ id: nanoid(), value: '' });
      setHashtags(nextHashtags);
    }
  };

  const removeHashtag = (id: string) => {
    setHashtags(hashtags.filter(hashtag => hashtag.id !== id));
  };

  const updateHashtags = (value: string, id: string) => {
    const hashtagIndex = hashtags.findIndex(hashtag => hashtag.id === id);
    const nextHashtags = [...hashtags];

    if (hashtagIndex === -1) {
      return;
    }

    let newValue = value;

    if (!newValue.startsWith('#')) {
      newValue = `#${value}`;
    }

    nextHashtags[hashtagIndex].value = newValue === '#' ? '' : newValue;
    setHashtags(nextHashtags);
  };

  return (
    <div className={styles.editHashtags}>
      <div className={styles.container}>
        {hashtags?.map(hashtag => {
          return (
            <HashtagInput
              id={hashtag.id}
              removeHashtag={removeHashtag}
              key={hashtag.id}
              value={hashtag.value}
              onChange={(value: string) => updateHashtags(value, hashtag.id)}
            />
          );
        })}
        {hashtags.length < MAX_HASHTAGS ? (
          <button
            className={styles.addHashtagButton}
            type="button"
            onClick={addHashtag}
          >
            #hashtag_name
          </button>
        ) : null}
        <div className={cn(styles.count, { [styles.error]: error })}>
          {hashtags.length}/{MAX_HASHTAGS}
        </div>
      </div>
    </div>
  );
};
