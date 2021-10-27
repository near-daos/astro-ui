import { VFC } from 'react';
import styles from './ntf-card.module.scss';

export interface NFTCardProps {
  name: string;
  image: StaticImageData;
  description?: string;
}

export const NFTCard: VFC<NFTCardProps> = ({ name, image }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    width="296px"
    height="424px"
    alt={name}
    src={image.src}
    loading="lazy"
    className={styles.root}
  />
);
