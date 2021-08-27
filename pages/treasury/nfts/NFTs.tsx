import React from 'react';
import { NFTCard } from 'features/nft/ntf-card/NFTCard';
import { NFT_CARDS_DATA } from 'pages/treasury/nfts/mock';
import styles from './nfts.module.scss';

interface NFTsProps {
  cards: StaticImageData[];
}

const NFTs: React.FC<NFTsProps> = ({ cards = NFT_CARDS_DATA }) => {
  return (
    <div className={styles.root}>
      <div className={styles.label}>All NFTs</div>
      <div className={styles.content}>
        {cards.map(img => (
          <div className={styles.card} key={img.src}>
            <NFTCard name={img.src} image={img} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTs;
