import axios from 'axios';
import React, { useEffect, useRef, useState, VFC } from 'react';

import { NFTUri } from 'types/token';

import styles from './NtfCard.module.scss';

export interface NFTCardProps {
  name: string;
  image: NFTUri[];
  description?: string;
}

export const NFTCard: VFC<NFTCardProps> = ({ name, image }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showError, setShowError] = useState(false);

  // We get image as src array because NFTs response comes in very different format
  // Here we try to load an image using all possible ways and once we found any working image source we
  // set it as a reals src for image
  // We add src property to image element here because of Chrome/Safari bug
  // when onLoad callback is not triggered is it is attached to element before src
  useEffect(() => {
    const { CancelToken } = axios;
    const source = CancelToken.source();

    Promise.allSettled(
      image.map(({ uri, isExternalReference }) => {
        return new Promise((resolve, reject) => {
          if (isExternalReference) {
            axios
              .get(uri, { cancelToken: source.token })
              .then(({ data }) => {
                const media = data?.media;

                if (media?.indexOf('http') === 0) {
                  const img = new Image();

                  img.onload = () => {
                    resolve(media);
                  };

                  img.onerror = () => {
                    reject();
                  };

                  img.src = media;
                } else {
                  reject();
                }
              })
              .catch(e => {
                reject(e);
              });
          } else {
            const img = new Image();

            img.onload = () => {
              resolve(uri);
            };

            img.onerror = () => {
              reject();
            };

            img.src = uri;
          }
        });
      })
    )
      .then(result => {
        const fulfilledResult = (result.find(
          item => item.status === 'fulfilled'
        ) as PromiseFulfilledResult<string> | undefined)?.value;

        if (fulfilledResult && imgRef?.current && linkRef?.current) {
          imgRef.current.src = fulfilledResult;
          linkRef.current.href = fulfilledResult;
        } else {
          setShowError(true);
        }
      })
      .catch(() => {
        setShowError(true);
      });

    return () => {
      source.cancel('Cancelled on unmount');
    };
  }, [image]);

  return (
    <div className={styles.root}>
      <div>
        <a href="*" rel="noopener noreferrer" target="_blank" ref={linkRef}>
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
        </a>
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
