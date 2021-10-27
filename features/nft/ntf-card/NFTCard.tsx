import Image from 'next/image';
import { VFC } from 'react';
import styles from './ntf-card.module.scss';

export interface NFTCardProps {
  name: string;
  image: StaticImageData;
  description?: string;
}

export const NFTCard: VFC<NFTCardProps> = ({ name, image }) => (
  <Image
    loading="eager"
    width="296px"
    height="424px"
    layout="intrinsic"
    alt={name}
    src={image}
    className={styles.root}
  />
);
