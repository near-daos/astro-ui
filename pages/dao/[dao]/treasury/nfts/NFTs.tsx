import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useAuthContext } from 'context/AuthContext';
import useToggleable from 'hooks/useToggleable';

import { NFTCard } from 'features/nft/ntf-card/NFTCard';

import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import NavLink from 'astro_2.0/components/NavLink';

import { ProposalVariant } from 'types/proposal';
import { NftToken } from 'types/token';
import { DAO } from 'types/dao';

import styles from './nfts.module.scss';

export interface NFTsPageProps {
  nfts: NftToken[];
  dao: DAO;
}

const NFTs: NextPage<NFTsPageProps> = ({ nfts = [], dao }) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const { accountId } = useAuthContext();

  const [ToggleableCreateProposal, toggleCreateProposal] = useToggleable(
    CreateProposal
  );

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/all/daos">All DAOs</NavLink>
        <NavLink href={`/dao/${daoId}`}>{dao?.displayName || dao?.id}</NavLink>
        <NavLink>NFTs</NavLink>
      </BreadCrumbs>
      <div className={styles.dao}>
        <DaoDetailsMinimized
          dao={dao}
          accountId={accountId}
          onCreateProposalClick={toggleCreateProposal}
        />
        <ToggleableCreateProposal
          dao={dao}
          showFlag={false}
          proposalVariant={ProposalVariant.ProposeTransfer}
          onCreate={isSuccess => isSuccess && toggleCreateProposal()}
          onClose={toggleCreateProposal}
        />
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
