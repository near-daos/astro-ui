import React, { useEffect, useState } from 'react';
import {
  // GetServerSideProps,
  NextPage
} from 'next';
import { NFTCard } from 'features/nft/ntf-card/NFTCard';
import { SputnikService } from 'services/SputnikService';

import { NftToken } from 'types/token';

import styles from 'pages/dao/[dao]/treasury/nfts/nfts.module.scss';
import { useRouter } from 'next/router';

const NFTs: NextPage = () => {
  const router = useRouter();
  const daoId = router.query.dao as string;

  const [nfts, setNfts] = useState<NftToken[]>([]);

  useEffect(() => {
    SputnikService.getAccountNFTs(daoId).then(setNfts);
  }, [daoId, nfts]);

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

// export const getServerSideProps: GetServerSideProps<{
//   nfts: NftToken[];
// }> = async ({ query }) => {
//   const daoId = query.dao as string;
//   const nfts = await SputnikService.getAccountNFTs(daoId);
//
//   return {
//     props: {
//       nfts
//     }
//   };
// };

export default NFTs;
