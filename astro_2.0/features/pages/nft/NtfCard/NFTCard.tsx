import Image from 'next/image';
import { VFC } from 'react';
import styles from './NtfCard.module.scss';

export interface NFTCardProps {
  name: string;
  image: StaticImageData;
  description?: string;
}

export const NFTCard: VFC<NFTCardProps> = ({ name, image }) => (
  <Image
    width="296px"
    height="424px"
    layout="intrinsic"
    alt={name}
    src={image}
    className={styles.root}
  />
);
