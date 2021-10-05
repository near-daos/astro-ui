import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { NFTCard } from 'features/nft/ntf-card/NFTCard';
import { SputnikService } from 'services/SputnikService';

import { NftToken } from 'types/token';

import styles from 'pages/dao/[dao]/treasury/nfts/nfts.module.scss';

interface NFTsProps {
  nfts: NftToken[];
}

const NFTs: NextPage<NFTsProps> = ({ nfts = [] }) => {
  return (
    <div className={styles.root}>
      <div className={styles.label}>All NFTs</div>
      <div className={styles.content}>
        {nfts.map(nft => (
          <div className={styles.card} key={nft.metadata.media}>
            <NFTCard
              name={nft.metadata.title}
              image={{
                src: `https://ipfs.io/ipfs/${nft.metadata.media}`,
                width: 296,
                height: 424
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  nfts: NftToken[];
}> = async ({ query }) => {
  const daoId = query.dao as string;
  const nfts = await SputnikService.getNfts(daoId);

  return {
    props: {
      nfts
    }
  };
};

export default NFTs;
