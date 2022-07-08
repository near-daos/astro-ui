/* eslint-disable jsx-a11y/no-autofocus */
import React, { FC, useState, useRef, useEffect } from 'react';

import { Badge } from 'components/Badge';
import { Icon } from 'components/Icon';

import styles from './HashtagInput.module.scss';

const MIN_WIDTH = 110;

type HashtagInputProps = {
  onChange: (value: string) => void;
  value: string;
  id: string;
  removeHashtag: (id: string) => void;
  onBlur: () => void;
};

export const HashtagInput: FC<HashtagInputProps> = ({
  onChange,
  value,
  id,
  removeHashtag,
  onBlur,
}) => {
  const [width, setWidth] = useState(MIN_WIDTH);
  const [focus, setFocus] = useState(false);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
    onBlur();
  };

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
    }
  }, [value]);

  return (
    <>
      <span className={styles.widthMeter} ref={spanRef}>
        {value}
      </span>
      {focus || value === '' ? (
        <input
          autoFocus
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ width }}
          className={styles.hashtagInput}
          type="text"
          onChange={event => onChange(event.target.value)}
          value={value}
          placeholder="#hashtag_name"
        />
      ) : (
        <Badge key={id} size="small" className={styles.tag} variant="lightgray">
          <>
            <button
              type="button"
              className={styles.tagValue}
              onClick={handleFocus}
            >
              {value}
            </button>
            <button
              className={styles.tagRemove}
              type="button"
              onClick={() => removeHashtag(id)}
            >
              <Icon name="close" />
            </button>
          </>
        </Badge>
      )}
    </>
  );
};
