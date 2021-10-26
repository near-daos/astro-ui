import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { NFTCard } from 'features/nft/ntf-card/NFTCard';
import { SputnikHttpService } from 'services/sputnik';

import { NftToken } from 'types/token';

import styles from 'pages/dao/[dao]/treasury/nfts/nfts.module.scss';

interface NFTsProps {
  nfts: NftToken[];
}

const NFTs: NextPage<NFTsProps> = ({ nfts = [] }) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>All NFTs</h1>
      </div>
      <div className={styles.content}>
        {nfts.map(nft => (
          <div className={styles.card} key={nft.uri}>
            <NFTCard
              name={nft.title}
              image={{
                src: `${nft.uri}`,
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
  const nfts = await SputnikHttpService.getAccountNFTs(daoId);

  return {
    props: {
      nfts
    }
  };
};

export default NFTs;
