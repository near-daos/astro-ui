import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NFTCard } from 'features/nft/ntf-card/NFTCard';
import NavLink from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';

import { NftToken } from 'types/token';
import { DAO } from 'types/dao';

import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { useAuthContext } from 'context/AuthContext';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { ProposalVariant } from 'types/proposal';

import styles from './nfts.module.scss';

export interface NFTsProps {
  nfts: NftToken[];
  dao: DAO;
}

const NFTs: NextPage<NFTsProps> = ({ nfts = [], dao }) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const { accountId } = useAuthContext();
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  const handleCreateProposal = useCallback(() => {
    setShowCreateProposal(true);
  }, []);

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <span>NFTs</span>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={handleCreateProposal}
        />
        {showCreateProposal && (
          <div className={styles.newProposalWrapper}>
            <CreateProposal
              dao={dao}
              proposalVariant={ProposalVariant.ProposeTransfer}
              onCreate={isSuccess => {
                if (isSuccess) {
                  setShowCreateProposal(false);
                }
              }}
              onClose={() => {
                setShowCreateProposal(false);
              }}
            />
          </div>
        )}
      </div>
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
                height: 424,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTs;
