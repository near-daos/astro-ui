import axios from 'axios';
import React, { useEffect, useRef, useState, VFC } from 'react';

import styles from './NtfCard.module.scss';

export interface NFTCardProps {
  name: string;
  image: StaticImageData;
  description?: string;
  isExternalReference?: boolean;
}

export const NFTCard: VFC<NFTCardProps> = ({
  name,
  image,
  isExternalReference,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showError, setShowError] = useState(false);

  // We add src property to image element here because of Chrome/Safari bug
  // when onLoad callback is not triggered is it is attached to element before src
  useEffect(() => {
    const { CancelToken } = axios;
    const source = CancelToken.source();

    if (isExternalReference) {
      axios
        .get(image.src, { cancelToken: source.token })
        .then(({ data }) => {
          const media = data?.media;

          if (media?.indexOf('http') === 0 && imgRef?.current) {
            imgRef.current.src = media;
          } else {
            setShowError(true);
          }
        })
        .catch(thrown => {
          setShowError(true);

          if (axios.isCancel(thrown)) {
            // do nothing - we cancel request on unmount
          }
        });
    } else if (imgRef?.current) {
      imgRef.current.src = image.src;
    }

    return () => {
      source.cancel('Cancelled on unmount');
    };
  }, [image.src, isExternalReference]);

  return (
    <div className={styles.root}>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          width="296px"
          height="424px"
          alt={name}
          onLoad={() => setShowPlaceholder(false)}
          src=""
          className={styles.image}
        />
      </div>
      {showPlaceholder && (
        <div className={styles.preloader}>
          <div className={styles.preloaderIcon}>
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
      {showError && <div className={styles.error}>Failed to load image</div>}
    </div>
  );
};
