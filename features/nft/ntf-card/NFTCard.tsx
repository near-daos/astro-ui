import { VFC } from 'react';
import styles from './ntf-card.module.scss';

export interface NFTCardProps {
  name: string;
  image: StaticImageData;
  description?: string;
}

export const NFTCard: VFC<NFTCardProps> = ({ name, image }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={styles.root} src={image.src} alt={name} />
  );
};
