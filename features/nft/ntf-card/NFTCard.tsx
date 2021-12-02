import Image from 'next/image';
import React, { useState, VFC } from 'react';
import { DotsLoader } from 'astro_2.0/components/DotsLoader';
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
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showError, setShowError] = useState(false);

  return (
    <div className={styles.root}>
      <div>
        {isExternalImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            width="296px"
            height="424px"
            src={image.src}
            alt={name}
            onLoad={() => setShowPlaceholder(false)}
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
          <DotsLoader dotClassName={styles.dot} className={styles.dots} />
        </div>
      )}
      {showError && <div className={styles.error}>Cannot display an image</div>}
    </div>
  );
};
