import Image from 'next/image';
import React, { useEffect, useRef, useState, VFC } from 'react';
import styles from './ntf-card.module.scss';

export interface NFTCardProps {
  name: string;
  image: StaticImageData;
  description?: string;
  isExternalImage?: boolean;
}

export const NFTCard: VFC<NFTCardProps> = ({
  name,
  image,
  isExternalImage,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showError, setShowError] = useState(false);

  // We add src property to image element here because of Chrome/Safari bug
  // when onLoad callback is not triggered is it is attached to element before src
  useEffect(() => {
    if (isExternalImage && imgRef?.current) {
      imgRef.current.src = image.src;
    }
  }, [image.src, isExternalImage]);

  return (
    <div className={styles.root}>
      <div>
        {isExternalImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            width="296px"
            height="424px"
            alt={name}
            onLoad={() => setShowPlaceholder(false)}
            src=""
            className={styles.image}
          />
        ) : (
          <Image
            width="296px"
            height="424px"
            layout="intrinsic"
            alt={name}
            onError={() => {
              setShowPlaceholder(false);
              setShowError(true);
            }}
            onLoad={() => setShowPlaceholder(false)}
            src={image.src}
            className={styles.image}
          />
        )}
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
