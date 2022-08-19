// TODO requires localisation

import axios from 'axios';
import cn from 'classnames';
import React, { useEffect, useRef, useState, VFC } from 'react';
import { ExplorerLink } from 'components/ExplorerLink';
import { Popup } from 'components/Popup';
import { Icon } from 'components/Icon';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { shortenString } from 'utils/format';
import { NFTUri } from 'types/token';

import { NFTActions } from 'features/proposal/components/ProposalActions/components/NFTActions';
import { CreateProposalProps } from 'astro_2.0/features/CreateProposal';

import styles from './NtfCard.module.scss';

export interface NFTCardProps {
  image: NFTUri[];
  contractId: string;
  tokenId: string;
  toggleCreateProposal?: (props?: Partial<CreateProposalProps>) => void;
}

export const NFTCard: VFC<NFTCardProps> = ({
  image,
  contractId,
  tokenId,
  toggleCreateProposal,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const nameRef = useRef('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showError, setShowError] = useState(false);
  const [contractIdPopup, setContractIdPopup] = useState<HTMLElement | null>(
    null
  );

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

                nameRef.current = data?.title;

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
        const fulfilledResult = (
          result.find(item => item.status === 'fulfilled') as
            | PromiseFulfilledResult<string>
            | undefined
        )?.value;

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

  function renderPlaceholder() {
    return (
      <div className={styles.preloader}>
        <div className={styles.preloaderIcon}>
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  function renderNtfCard() {
    if (showError) {
      return (
        <div className={styles.error}>
          <Icon name="imageNotFound" width={58} className={styles.errorIcon} />
          Failed to load NFT
        </div>
      );
    }

    return (
      <a
        href="*"
        rel="noopener noreferrer"
        target="_blank"
        ref={linkRef}
        className={styles.link}
      >
        <div className={styles.imageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            alt={nameRef.current}
            onLoad={() => setShowPlaceholder(false)}
            src=""
            className={styles.image}
          />
        </div>
        <div className={cn(styles.actions)}>
          <NFTActions
            contractId={contractId}
            tokenId={tokenId}
            toggleCreateProposal={toggleCreateProposal}
          />
        </div>
        <div className={styles.description}>
          <div className={styles.name}>{nameRef.current}</div>
          <div className={styles.info}>
            <div className={styles.contract} ref={setContractIdPopup}>
              {shortenString(contractId, 19)}
            </div>
            {contractId.length > 19 && (
              <Popup anchor={contractIdPopup}>{contractId}</Popup>
            )}
            <div>
              <ExplorerLink
                linkData={contractId}
                linkType="member"
                textLabel="To the explorer"
              />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.contract}>
              <div className={styles.label}>Token ID</div>
            </div>
            <div className={cn(styles.contract, styles.value)}>
              <CopyButton text={tokenId} showIcon={false}>
                {tokenId}
              </CopyButton>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className={styles.root}>
      {showPlaceholder && !showError && renderPlaceholder()}
      {renderNtfCard()}
    </div>
  );
};
